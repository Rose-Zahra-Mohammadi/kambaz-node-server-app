import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
export default function EnrollmentsDao(db) {
  function enrollUserInCourse(userId, courseId) {
    return model.create({ user: userId, course: courseId, _id: `${userId}-${courseId}`});
  }

  function unenrollUserFromCourse(userId, courseId) {

    return model.deleteOne({ user: userId, course: courseId });
  }

  function findEnrollmentsForUser(userId) {
    return db.enrollments.filter(e => e.user === userId);
  }

  function findEnrollmentsForCourse(courseId) {
    return db.enrollments.filter(e => e.course === courseId);
  }

  function isUserEnrolled(userId, courseId) {
    return db.enrollments.some(
      e => e.user === userId && e.course === courseId
    );
  }
 async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
   }
   function unenrollAllUsersFromCourse(courseId) {
    return model.deleteMany({ course: courseId });
  }
 

  return {
    enrollUserInCourse,
    unenrollUserFromCourse,
    findEnrollmentsForUser,
    findEnrollmentsForCourse,
    isUserEnrolled,
    findCoursesForUser,
    unenrollAllUsersFromCourse
  };
}
