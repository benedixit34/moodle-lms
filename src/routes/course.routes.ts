import { Router } from "express";
import { getCoursesController } from "../controllers/course.controller.js";

const router = Router();

router.get("/", getCoursesController);

export default router;