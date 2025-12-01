import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function EnrollmentsDao() {
  async function enrollUserInCourse(userId, courseId) {
    // Check if already enrolled
    const existing = await model.findOne({ user: userId, course: courseId });
    if (existing) {
      return existing;
    }
    return await model.create({ user: userId, course: courseId, _id: `${userId}-${courseId}`});
  }

  async function unenrollUserFromCourse(userId, courseId) {
    const result = await model.deleteOne({ user: userId, course: courseId });
    return result.deletedCount > 0;
  }

  async function findEnrollmentsForUser(userId) {
    return await model.find({ user: userId });
  }

  async function findEnrollmentsForCourse(courseId) {
    return await model.find({ course: courseId });
  }

  async function isUserEnrolled(userId, courseId) {
    const enrollment = await model.findOne({ user: userId, course: courseId });
    return enrollment !== null;
  }

  async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
  }

  async function unenrollAllUsersFromCourse(courseId) {
    return await model.deleteMany({ course: courseId });
  }

  async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments.map((enrollment) => enrollment.user).filter(user => user !== null);
  }
 

  return {
    enrollUserInCourse,
    unenrollUserFromCourse,
    findEnrollmentsForUser,
    findEnrollmentsForCourse,
    isUserEnrolled,
    findCoursesForUser,
    unenrollAllUsersFromCourse,
    findUsersForCourse
  };
}
