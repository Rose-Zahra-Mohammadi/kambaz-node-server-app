import EnrollmentsDao from "./dao.js";

export default function EnrollmentRoutes(app, db) {
  const dao = EnrollmentsDao();

  const enrollUserInCourse = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const { courseId } = req.params;
      const enrollment = await dao.enrollUserInCourse(currentUser._id, courseId);
      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ message: "Error enrolling in course", error: error.message });
    }
  };

  const unenrollUserFromCourse = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const { courseId } = req.params;
      const success = await dao.unenrollUserFromCourse(currentUser._id, courseId);
      if (!success) {
        res.status(404).json({ message: "Enrollment not found" });
        return;
      }
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ message: "Error unenrolling from course", error: error.message });
    }
  };

  const getEnrollmentsForCurrentUser = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const enrollments = await dao.findEnrollmentsForUser(currentUser._id);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching enrollments", error: error.message });
    }
  };

  app.post("/api/courses/:courseId/enroll", enrollUserInCourse);
  app.delete("/api/courses/:courseId/enroll", unenrollUserFromCourse);
  app.get("/api/users/current/enrollments", getEnrollmentsForCurrentUser);
}

