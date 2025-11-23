import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";
import ModulesDao from "../Modules/dao.js";
export default function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);
  const modulesDao = ModulesDao(db);
  const createCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const newCourse = dao.createCourse(req.body);
    res.json(newCourse);
  };

  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = dao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };
  const findAllCourses = (req, res) => {
    const courses = dao.findAllCourses();
    res.json(courses);
  };

  const findCourseById = (req, res) => {
    const { courseId } = req.params;
    const course = dao.findCourseById(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    res.json(course);
  };

  const findModulesForCourse = (req, res) => {
    const { courseId } = req.params;
    const modules = modulesDao.findModulesForCourse(courseId);
    res.json(modules);
  };

  const createModule = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { courseId } = req.params;
    const newModule = modulesDao.createModule(courseId, req.body);
    res.json(newModule);
  };

  const updateModule = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { moduleId } = req.params;
    const updatedModule = modulesDao.updateModule(moduleId, req.body);
    if (!updatedModule) {
      res.status(404).json({ message: "Module not found" });
      return;
    }
    res.json(updatedModule);
  };

  const deleteModule = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { moduleId } = req.params;
    const deleted = modulesDao.deleteModule(moduleId);
    if (!deleted) {
      res.status(404).json({ message: "Module not found" });
      return;
    }
    res.sendStatus(200);
  };

  const updateCourse = (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  }
  app.get("/api/courses", findAllCourses);
  app.get("/api/courses/:courseId", findCourseById);
  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/courses", createCourse);
  app.put("/api/courses/:courseId", updateCourse);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.post("/api/courses/:courseId/modules", createModule);
  app.put("/api/courses/:courseId/modules/:moduleId", updateModule);
  app.delete("/api/courses/:courseId/modules/:moduleId", deleteModule);
}
