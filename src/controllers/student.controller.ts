
import type { Request, Response } from "express";
import { createStudent } from "../services/student.service.js";

export async function createStudentController(
  req: Request,
  res: Response
) {
  try {
    const student = await createStudent(req.body);

    res.status(201).json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create student",
    });
  }
}

