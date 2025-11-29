import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";
import ModulesDao from "../Modules/dao.js";
export default function CourseRoutes(app, db) {
  const dao = CoursesDao();
  const enrollmentsDao = EnrollmentsDao(db);
  const modulesDao = ModulesDao(db);
  const createCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const newCourse = await dao.createCourse(req.body);
    res.json(newCourse);
  };
const deleteCourse = async (req, res) => {
  const { courseId } = req.params;
  await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
  const status = await dao.deleteCourse(courseId);
  res.json(status);
};
  const findCoursesForEnrolledUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses =  await enrollmentsDao.findCoursesForUser(userId);
    res.json(courses);
  };
  const findAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
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

  const findModulesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const modules = await modulesDao.findModulesForCourse(courseId);
    res.json(modules);
  };

  const createModule = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { courseId } = req.params;
    const newModule = await modulesDao.createModule(courseId, req.body);
    res.json(newModule);
  };

  const updateModule = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { courseId, moduleId } = req.params;
    const status = await modulesDao.updateModule(courseId, moduleId, req.body);
    if (!status) {
      res.status(404).json({ message: "Module not found" });
      return;
    }
    res.json(status);
  };

  const deleteModule = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { courseId, moduleId } = req.params;
    const deleted = await modulesDao.deleteModule(courseId, moduleId);
    if (!deleted) {
      res.status(404).json({ message: "Module not found" });
      return;
    }
    res.sendStatus(200);
  };

  const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  }

  const enrollUserInCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
    res.send(status);
  };
  const unenrollUserFromCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
    res.send(status);
  };

  const findUsersForCourse = async (req, res) => {
    const { cid } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(cid);
    res.json(users);
  }
  app.get("/api/courses/:cid/users", findUsersForCourse);
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
  app.get("/api/courses", findAllCourses);
  app.get("/api/courses/:courseId", findCourseById);
  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/courses", createCourse);
  app.put("/api/courses/:courseId", updateCourse);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.post("/api/courses/:courseId/modules", createModule);
  app.put("/api/courses/:courseId/modules/:moduleId", updateModule);
  app.delete("/api/courses/:courseId/modules/:moduleId", deleteModule);
  app.delete("/api/courses/:courseId", deleteCourse);
}
