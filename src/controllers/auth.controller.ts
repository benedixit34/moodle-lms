import type { Request, Response } from "express";
import { loginToMoodle } from "../services/auth.service.js";

export async function login(
  req: Request,
  res: Response
) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const result = await loginToMoodle(
      username,
      password
    );

    return res.status(200).json({
      success: true,
      token: result.token,
      privatetoken: result.privatetoken,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to authenticate",
    });
  }
}
