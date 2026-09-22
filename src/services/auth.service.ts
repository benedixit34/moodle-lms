import "dotenv/config";

interface MoodleLoginResponse {
  token?: string;
  privatetoken?: string;
  error?: string;
  errorcode?: string;
  stacktrace?: string;
  debuginfo?: string;
}

export async function loginToMoodle(
  username: string,
  password: string
): Promise<MoodleLoginResponse> {
  const response = await fetch(
    `${process.env.MOODLE_URL}/login/token.php`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username,
        password,
        service: "moodle_mobile_app",
      }),
    }
  );

  const data = (await response.json()) as MoodleLoginResponse;

  if (!response.ok || data.error) {
    throw new Error(data.error || "Moodle login failed");
  }

  return data;
}

