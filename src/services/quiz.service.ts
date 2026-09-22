import "dotenv/config";

const MOODLE_URL = process.env.MOODLE_URL!;
const MOODLE_TOKEN = process.env.MOODLE_TOKEN!;

async function moodleRequest<T>(
  functionName: string,
  params: Record<string, string | number>
): Promise<T> {
  const url = new URL(`${MOODLE_URL}/webservice/rest/server.php`);

  url.searchParams.set("wstoken", MOODLE_TOKEN);
  url.searchParams.set("wsfunction", functionName);
  url.searchParams.set("moodlewsrestformat", "json");

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Moodle request failed: ${response.status}`);
  }

  const data = await response.json();

  if (data.exception) {
    throw new Error(data.message || "Moodle API error");
  }

  return data;
}

export async function getQuizzes(courseId: number) {
  return moodleRequest(
    "mod_quiz_get_quizzes_by_courses",
    {
      "courseids[0]": courseId,
    }
  );
}

export async function getQuiz(quizId: number) {
  return moodleRequest(
    "mod_quiz_get_quizzes_by_courses",
    {
      "courseids[0]": quizId,
    }
  );
}

export async function getQuizAttemptData(
  attemptId: number,
  page = 0
) {
  return moodleRequest(
    "mod_quiz_get_attempt_data",
    {
      attemptid: attemptId,
      page,
    }
  );
}


export async function startQuizAttempt(
  quizId: number,
  preflightData: Record<string, string> = {}
) {
  const params: Record<string, string | number> = {
    quizid: quizId,
  };

  Object.entries(preflightData).forEach(([key, value]) => {
    params[`preflightdata[${key}]`] = value;
  });

  return moodleRequest(
    "mod_quiz_start_attempt",
    params
  );
}


export async function getQuizAttempt(attemptId: number) {
  return moodleRequest(
    "mod_quiz_get_attempt_data",
    {
      attemptid: attemptId,
    }
  );
}


export async function saveQuizAnswers(
  attemptId: number,
  answers: Record<string, string>
) {
  const params: Record<string, string | number> = {
    attemptid: attemptId,
  };

  Object.entries(answers).forEach(([slot, answer]) => {
    params[`data[${slot}][name]`] = `q${slot}:answer`;
    params[`data[${slot}][value]`] = answer;
  });

  return moodleRequest(
    "mod_quiz_save_attempt",
    params
  );
}


export async function finishQuizAttempt(
  attemptId: number,
  timeUp = false
) {
  return moodleRequest(
    "mod_quiz_process_attempt",
    {
      attemptid: attemptId,
      timeup: timeUp ? 1 : 0,
    }
  );
}