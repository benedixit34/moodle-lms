import { Router } from "express";

import {
  getCourseQuizzes,
  startAttempt,
  getAttemptData,
  saveAnswers,
  finishAttempt,
} from "../controllers/quiz.controller";

const router = Router();

router.get("/courses/:courseId/all", getCourseQuizzes);

router.post("/all/:quizId/attempts", startAttempt);

router.get("/attempts/:attemptId", getAttemptData);

router.post("/attempts/:attemptId/answers", saveAnswers);

router.post("/attempts/:attemptId/finish", finishAttempt);

export default router;
