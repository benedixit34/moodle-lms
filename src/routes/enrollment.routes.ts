import { Router } from "express";

import {
  getEnrolledCourses,
  selfEnroll,
  manualEnroll,
} from "../controllers/enrollment.controller";

const router = Router();

router.get("/users/:userId/courses", getEnrolledCourses);

router.post("/self", selfEnroll);

router.post("/manual", manualEnroll);

export default router;