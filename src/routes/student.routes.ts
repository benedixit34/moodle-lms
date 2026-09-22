import { Router } from "express";
import { createStudentController } from "../controllers/student.controller.js";

const router = Router();

router.post("/", createStudentController);

export default router;
