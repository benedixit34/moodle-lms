import { Router } from "express";

import {
  getAllCourses,
  getSingleCourse,
  getCourseImage
} from "../controllers/course.controller";

const router = Router();

router.get("/", getAllCourses);
router.get("/:courseId", getSingleCourse);
router.get(
  "/:courseId/image",
  getCourseImage
);

export default router;