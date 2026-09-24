import "dotenv/config";

const MOODLE_URL = process.env.MOODLE_URL!;
const MOODLE_TOKEN = process.env.MOODLE_TOKEN!;


interface EnrollmentMethod {
  type: string;
  name?: string;
  passwordrequired?: boolean;
  status?: number;
  [key: string]: unknown;
}


interface SelfEnrollmentResult {
  requiresEnrollmentKey?: boolean;
  [key: string]: unknown;
}

interface ManualEnrollmentResult {
  enrolled: boolean;
  data?: unknown;
}

export async function getCourseEnrollmentMethods(
  courseId: number
): Promise<EnrollmentMethod[]> {
  return moodleRequest<EnrollmentMethod[]>(
    "core_enrol_get_course_enrolment_methods",
    {
      courseid: courseId,
    }
  );
}

async function moodleRequest<T>(
  functionName: string,
  params: Record<string, string | number>
): Promise<T> {
  const url = new URL(
    `${MOODLE_URL}/webservice/rest/server.php`
  );

  url.searchParams.set("wstoken", MOODLE_TOKEN);
  url.searchParams.set("wsfunction", functionName);
  url.searchParams.set("moodlewsrestformat", "json");

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Moodle request failed: ${response.status}`
    );
  }

  const data = await response.json();

  if (data.exception) {
    throw new Error(data.message || "Moodle API error");
  }

  return data;
}

export async function getUserCourses(userId: number) {
  return moodleRequest(
    "core_enrol_get_users_courses",
    {
      userid: userId,
    }
  );
}


export async function checkSelfEnrollment(courseId: number) {
  const methods = await getCourseEnrollmentMethods(courseId);

  const selfEnrollment = methods.find(
    (method: any) => method.type === "self"
  );

  if (!selfEnrollment) {
    return {
      canSelfEnroll: false,
      requiresEnrollmentKey: false,
    };
  }

  return {
    canSelfEnroll: true,
    requiresEnrollmentKey:
      selfEnrollment.passwordrequired === true,
  };
}


export async function selfEnrollUser(
  userId: number,
  courseId: number,
  enrollmentKey?: string
): Promise<SelfEnrollmentResult> {
  const enrollment = await checkSelfEnrollment(courseId);

  if (!enrollment.canSelfEnroll) {
    throw new Error(
      "Self enrollment is not available for this course"
    );
  }

  if (enrollment.requiresEnrollmentKey && !enrollmentKey) {
    return {
      requiresEnrollmentKey: true,
    };
  }

  return moodleRequest<SelfEnrollmentResult>(
    "enrol_self_enrol_user",
    {
      userid: userId,
      courseid: courseId,
      ...(enrollmentKey
        ? { password: enrollmentKey }
        : {}),
    }
  );
}


export async function enrollUser(
  userId: number,
  courseId: number,
  roleId = 5
): Promise<ManualEnrollmentResult> {
  const result = await moodleRequest(
    "enrol_manual_enrol_users",
    {
      "enrolments[0][roleid]": roleId,
      "enrolments[0][userid]": userId,
      "enrolments[0][courseid]": courseId,
    }
  );

  return {
    enrolled: true,
    data: result,
  };
}