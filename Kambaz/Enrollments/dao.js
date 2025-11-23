import { v4 as uuidv4 } from "uuid";
export default function EnrollmentsDao(db) {
  function enrollUserInCourse(userId, courseId) {
    // Check if already enrolled
    const existing = db.enrollments.find(
      e => e.user === userId && e.course === courseId
    );
    if (existing) {
      return existing;
    }
    const newEnrollment = { _id: uuidv4(), user: userId, course: courseId };
    db.enrollments.push(newEnrollment);
    return newEnrollment;
  }

  function unenrollUserFromCourse(userId, courseId) {
    const index = db.enrollments.findIndex(
      e => e.user === userId && e.course === courseId
    );
    if (index === -1) {
      return false;
    }
    db.enrollments.splice(index, 1);
    return true;
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

  return {
    enrollUserInCourse,
    unenrollUserFromCourse,
    findEnrollmentsForUser,
    findEnrollmentsForCourse,
    isUserEnrolled
  };
}
