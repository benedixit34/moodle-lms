import express from "express";
import authRoutes  from "./routes/auth.routes"
import studentRoutes from "./routes/student.routes"
import courseRoutes from "./routes/course.routes"
import quizRoutes from "./routes/quiz.routes"
import enrollmentRoutes from "./routes/enrollment.routes"

const app = express();

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Seed Portal API is running",
  });
});

const PORT = 3000;

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes)
app.use("/api/courses", courseRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/enroll", enrollmentRoutes);





app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});