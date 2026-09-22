import type { Request, Response } from "express";

import {
  getQuizzes,
  startQuizAttempt,
  getQuizAttemptData,
  saveQuizAnswers,
  finishQuizAttempt,
} from "../services/quiz.service";

export async function getCourseQuizzes(
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

    const quizzes = await getQuizzes(courseId);

    return res.status(200).json(quizzes);
  } catch (error) {
    console.error("Get course quizzes error:", error);

    return res.status(500).json({
      message: "Failed to get quizzes",
    });
  }
}

export async function startAttempt(
  req: Request,
  res: Response
) {
  try {
    const quizId = Number(req.params.quizId);

    if (!Number.isInteger(quizId) || quizId <= 0) {
      return res.status(400).json({
        message: "Invalid quiz ID",
      });
    }

    const attempt = await startQuizAttempt(quizId);

    return res.status(200).json(attempt);
  } catch (error) {
    console.error("Start quiz attempt error:", error);

    return res.status(500).json({
      message: "Failed to start quiz attempt",
    });
  }
}

export async function getAttemptData(
  req: Request,
  res: Response
) {
  try {
    const attemptId = Number(req.params.attemptId);
    const page = req.query.page
      ? Number(req.query.page)
      : 0;

    if (!Number.isInteger(attemptId) || attemptId <= 0) {
      return res.status(400).json({
        message: "Invalid attempt ID",
      });
    }

    if (!Number.isInteger(page) || page < 0) {
      return res.status(400).json({
        message: "Invalid page",
      });
    }

    const attempt = await getQuizAttemptData(
      attemptId,
      page
    );

    return res.status(200).json(attempt);
  } catch (error) {
    console.error("Get quiz attempt data error:", error);

    return res.status(500).json({
      message: "Failed to get quiz attempt data",
    });
  }
}

export async function saveAnswers(
  req: Request,
  res: Response
) {
  try {
    const attemptId = Number(req.params.attemptId);
    const { answers } = req.body;

    if (!Number.isInteger(attemptId) || attemptId <= 0) {
      return res.status(400).json({
        message: "Invalid attempt ID",
      });
    }

    if (
      !answers ||
      typeof answers !== "object" ||
      Array.isArray(answers)
    ) {
      return res.status(400).json({
        message: "Answers must be an object",
      });
    }

    const result = await saveQuizAnswers(
      attemptId,
      answers
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Save quiz answers error:", error);

    return res.status(500).json({
      message: "Failed to save quiz answers",
    });
  }
}

export async function finishAttempt(
  req: Request,
  res: Response
) {
  try {
    const attemptId = Number(req.params.attemptId);
    const timeUp = Boolean(req.body?.timeUp);

    if (!Number.isInteger(attemptId) || attemptId <= 0) {
      return res.status(400).json({
        message: "Invalid attempt ID",
      });
    }

    const result = await finishQuizAttempt(
      attemptId,
      timeUp
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Finish quiz attempt error:", error);

    return res.status(500).json({
      message: "Failed to finish quiz attempt",
    });
  }
}