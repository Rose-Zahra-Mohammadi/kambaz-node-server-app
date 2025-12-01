import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";
import ModulesDao from "../Modules/dao.js";
import seedCourses from "../Database/courses.js";
export default function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao();
  const modulesDao = ModulesDao(db);
  const createCourse = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const newCourse = await dao.createCourse(req.body);
      // Auto-enroll the creator (faculty) in the course they just created
      await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
      res.json(newCourse);
    } catch (error) {
      res.status(500).json({ message: "Error creating course", error: error.message });
    }
  };
  const deleteCourse = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const { courseId } = req.params;
      await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
      const result = await dao.deleteCourse(courseId);
      if (result.deletedCount === 0) {
        res.status(404).json({ message: "Course not found" });
        return;
      }
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ message: "Error deleting course", error: error.message });
    }
  };
  const findCoursesForEnrolledUser = async (req, res) => {
    try {
      let { userId } = req.params;
      if (userId === "current") {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
          res.sendStatus(401);
          return;
        }
        userId = currentUser._id;
      }
      const courses = await dao.findCoursesForEnrolledUser(userId);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Error fetching courses", error: error.message });
    }
  };
  const findAllCourses = async (req, res) => {
    try {
      const courses = await dao.findAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Error fetching courses", error: error.message });
    }
  };

  const findCourseById = async (req, res) => {
    try {
      const { courseId } = req.params;
      const course = await dao.findCourseById(courseId);
      if (!course) {
        res.status(404).json({ message: "Course not found" });
        return;
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Error fetching course", error: error.message });
    }
  };

  const findModulesForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const modules = await modulesDao.findModulesForCourse(courseId);
      res.json(modules || []);
    } catch (error) {
      res.status(500).json({ message: "Error fetching modules", error: error.message });
    }
  };

  const createModule = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const { courseId } = req.params;
      const newModule = await modulesDao.createModule(courseId, req.body);
      res.json(newModule);
    } catch (error) {
      res.status(500).json({ message: "Error creating module", error: error.message });
    }
  };

  const updateModule = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const { courseId, moduleId } = req.params;
      const updatedModule = await modulesDao.updateModule(courseId, moduleId, req.body);
      if (!updatedModule) {
        res.status(404).json({ message: "Module not found" });
        return;
      }
      res.json(updatedModule);
    } catch (error) {
      res.status(500).json({ message: "Error updating module", error: error.message });
    }
  };

  const deleteModule = async (req, res) => {
    try {
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
      res.json({ message: "Module deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting module", error: error.message });
    }
  };

  const updateCourse = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser || currentUser.role !== "FACULTY") {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const { courseId } = req.params;
      const courseUpdates = req.body;
      const result = await dao.updateCourse(courseId, courseUpdates);
      if (result.matchedCount === 0) {
        res.status(404).json({ message: "Course not found" });
        return;
      }
      // Fetch and return the updated course
      const updatedCourse = await dao.findCourseById(courseId);
      res.json(updatedCourse);
    } catch (error) {
      res.status(500).json({ message: "Error updating course", error: error.message });
    }
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

  // Route to populate images for existing courses
  const populateImages = async (req, res) => {
    try {
      let updated = 0;
      let notFound = 0;
      
      for (const seedCourse of seedCourses) {
        // Check if course exists first
        const course = await dao.findCourseById(seedCourse._id);
        if (course) {
          const result = await dao.updateCourse(seedCourse._id, { image: seedCourse.image });
          if (result.modifiedCount > 0) {
            updated++;
          }
        } else {
          notFound++;
        }
      }
      
      res.json({ 
        message: `Updated ${updated} courses with images`,
        updated,
        notFound,
        total: seedCourses.length
      });
    } catch (error) {
      res.status(500).json({ message: "Error populating images", error: error.message });
    }
  };

  app.post("/api/courses/populate-images", populateImages);
}
