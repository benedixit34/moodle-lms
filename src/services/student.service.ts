
import "dotenv/config"


export async function createStudent({
  username,
  password,
  firstname,
  lastname,
  email,
}: {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
}) {
  const params = new URLSearchParams({
    wstoken: process.env.MOODLE_TOKEN!,
    wsfunction: "core_user_create_users",
    moodlewsrestformat: "json",
    "users[0][username]": username,
    "users[0][password]": password,
    "users[0][firstname]": firstname,
    "users[0][lastname]": lastname,
    "users[0][email]": email,
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
    throw new Error(data.message || "Failed to create student");
  }

  return data;
}

