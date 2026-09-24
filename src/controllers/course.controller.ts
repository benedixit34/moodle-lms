import type { Request, Response } from "express";

import {
  getCourses,
  getCourse,
} from "../services/course.service";

export async function getAllCourses(
  req: Request,
  res: Response
) {
  try {
    const courses = await getCourses();

    return res.status(200).json(courses);
  } catch (error) {
    console.error("Get courses error:", error);

    return res.status(500).json({
      message: "Failed to get courses",
    });
  }
}

export async function getSingleCourse(
  req: Request,
  res: Response
) {
  try {
    const courseId = Number(req.params.courseId);

    if (!Number.isInteger(courseId) || courseId <= 0) {
      return res.status(400).json({
        message: "Invalid course ID",
      });
    }

    const course = await getCourse(courseId);

    return res.status(200).json(course);
  } catch (error) {
    console.error("Get course error:", error);

    if (
      error instanceof Error &&
      error.message === "Course not found"
    ) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    return res.status(500).json({
      message: "Failed to get course",
    });
  }
}


export async function getCourseImage(
  req: Request,
  res: Response
) {
  try {
    const courseId = Number(req.params.courseId);

    if (!Number.isInteger(courseId) || courseId <= 0) {
      return res.status(400).json({
        message: "Invalid course ID",
      });
    }

    const course = await getCourse(courseId);

    const fileUrl =
      course.overviewfiles?.[0]?.fileurl;

    if (!fileUrl) {
      return res.status(404).json({
        message: "Course image not found",
      });
    }

    const imageUrl = new URL(fileUrl);

    imageUrl.searchParams.set(
      "token",
      process.env.MOODLE_TOKEN!
    );

    const response = await fetch(imageUrl);

    if (!response.ok) {
      return res.status(404).json({
        message: "Failed to retrieve course image",
      });
    }

    const contentType =
      response.headers.get("content-type") ??
      "application/octet-stream";

    const buffer = Buffer.from(
      await response.arrayBuffer()
    );

    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Cache-Control",
      "public, max-age=3600"
    );

    return res.send(buffer);
  } catch (error) {
    console.error("Get course image error:", error);

    return res.status(500).json({
      message: "Failed to get course image",
    });
  }
}