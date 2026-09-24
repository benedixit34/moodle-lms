import type { Request, Response } from "express";

import {
  getUserCourses,
  selfEnrollUser,
  enrollUser
} from "../services/enrollment.service";




export async function getEnrolledCourses(
  req: Request,
  res: Response   
) {
  try {
    const userId = Number(req.params.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const courses = await getUserCourses(userId);

    return res.status(200).json(courses);
  } catch (error) {
    console.error("Get enrolled courses error:", error);

    return res.status(500).json({
      message: "Failed to get enrolled courses",
    });
  }
}

export async function selfEnroll(
  req: Request,
  res: Response
) {
  try {
    const userId = Number(req.body.userId);
    const courseId = Number(req.body.courseId);
    const enrollmentKey = req.body.enrollmentKey;

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    if (!Number.isInteger(courseId) || courseId <= 0) {
      return res.status(400).json({
        message: "Invalid course ID",
      });
    }

    if (
      enrollmentKey !== undefined &&
      typeof enrollmentKey !== "string"
    ) {
      return res.status(400).json({
        message: "Invalid enrollment key",
      });
    }

    const result = await selfEnrollUser(
      userId,
      courseId,
      enrollmentKey
    );

    if (result?.requiresEnrollmentKey) {
      return res.status(200).json({
        requiresEnrollmentKey: true,
        message: "Enrollment key required",
      });
    }

    return res.status(200).json({
      message: "User enrolled successfully",
      data: result,
    });
  } catch (error) {
    console.error("Self enrollment error:", error);

    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to enroll user",
    });
  }
}


export async function manualEnroll(
  req: Request,
  res: Response
) {
  try {
    const userId = Number(req.body.userId);
    const courseId = Number(req.body.courseId);
    const roleId = req.body.roleId
      ? Number(req.body.roleId)
      : 5;

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    if (!Number.isInteger(courseId) || courseId <= 0) {
      return res.status(400).json({
        message: "Invalid course ID",
      });
    }

    if (!Number.isInteger(roleId) || roleId <= 0) {
      return res.status(400).json({
        message: "Invalid role ID",
      });
    }

    const result = await enrollUser(
      userId,
      courseId,
      roleId
    );

    return res.status(200).json({
      message: "User enrolled successfully",
      data: result,
    });
  } catch (error) {
    console.error("Manual enrollment error:", error);

    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to enroll user",
    });
  }
}