import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function AssignmentsDao() {
  async function findAllAssignments() {
    return await model.find().lean();
  }

  async function findAssignmentById(assignmentId) {
    return await model.findById(assignmentId);
  }

  async function findAssignmentsForCourse(courseId) {
    return await model.find({ course: courseId }).lean();
  }

  async function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: assignment._id || uuidv4() };
    return await model.create(newAssignment);
  }

  async function updateAssignment(assignmentId, assignmentUpdates) {
    const result = await model.updateOne({ _id: assignmentId }, { $set: assignmentUpdates });
    if (result.matchedCount === 0) {
      return null;
    }
    return await model.findById(assignmentId);
  }

  async function deleteAssignment(assignmentId) {
    const result = await model.deleteOne({ _id: assignmentId });
    return result.deletedCount > 0;
  }

  return {
    findAllAssignments,
    findAssignmentById,
    findAssignmentsForCourse,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}

