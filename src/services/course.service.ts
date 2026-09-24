import "dotenv/config";

const MOODLE_URL = process.env.MOODLE_URL!;
const MOODLE_TOKEN = process.env.MOODLE_TOKEN!;

async function moodleRequest<T>(
  functionName: string,
  params: Record<string, string | number> = {}
): Promise<T> {
  const searchParams = new URLSearchParams({
    wstoken: MOODLE_TOKEN,
    wsfunction: functionName,
    moodlewsrestformat: "json",
  });

  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, String(value));
  });

  const response = await fetch(
    `${MOODLE_URL}/webservice/rest/server.php`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: searchParams,
    }
  );

  const data = await response.json();

  if (!response.ok || data.exception) {
    throw new Error(
      data.message || `Failed to execute ${functionName}`
    );
  }

  return data;
}

export async function getCourses() {
  return moodleRequest(
    "core_course_get_courses"
  );
}

export async function getCourse(courseId: number) {
  const result = await moodleRequest<{
    courses: any[];
  }>(
    "core_course_get_courses_by_field",
    {
      field: "id",
      value: courseId,
    }
  );

  const course = result.courses?.[0];

  if (!course) {
    throw new Error("Course not found");
  }

  return course;
}