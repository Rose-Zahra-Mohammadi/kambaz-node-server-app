import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import enrollmentModel from "../Enrollments/model.js";

export default function CoursesDao(db) {
  async function findAllCourses() {
    return await model.find().lean();
  }

  async function findCourseById(courseId) {
    return await model.findById(courseId);
  }

  async function findCoursesForEnrolledUser(userId) {
    // Get all enrollments for this user
    const enrollments = await enrollmentModel.find({ user: userId });
    const courseIds = enrollments.map(e => e.course);
    // Get all courses where user is enrolled
    const courses = await model.find({ _id: { $in: courseIds } });
    return courses;
  }

  async function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    return await model.create(newCourse);
  }

  async function deleteCourse(courseId) {
    return await model.deleteOne({ _id: courseId });
  }

  async function updateCourse(courseId, courseUpdates) {
    return await model.updateOne({ _id: courseId }, { $set: courseUpdates });
  }
  

  return { findAllCourses, findCourseById, findCoursesForEnrolledUser, createCourse, deleteCourse, updateCourse };
}
