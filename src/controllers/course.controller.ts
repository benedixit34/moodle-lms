import type { Request, Response } from "express";
import { getCourses } from "../services/course.service.js";

export async function getCoursesController(
  _req: Request,
  res: Response
) {
  try {
    const courses = await getCourses();

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get courses",
    });
  }
}