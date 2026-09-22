import "dotenv/config"


export async function getCourses() {
  const params = new URLSearchParams({
    wstoken: process.env.MOODLE_TOKEN!,
    wsfunction: "core_course_get_courses",
    moodlewsrestformat: "json",
  });

  const response = await fetch(
    `${process.env.MOODLE_URL}/webservice/rest/server.php`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    }
  );

  const data = await response.json();

  if (!response.ok || data.exception) {
    throw new Error(data.message || "Failed to get courses");
  }

  return data;
}