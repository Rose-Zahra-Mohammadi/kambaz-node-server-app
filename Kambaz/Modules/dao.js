import { v4 as uuidv4 } from "uuid";
import model from "../Courses/model.js";
export default function ModulesDao(db) {
  async function findModulesForCourse(courseId) {
    const course = await model.findById(courseId).lean();
    if (!course) {
      return [];
    }
    // Add course field to each module so frontend can filter if needed
    const modules = (course.modules || []).map(module => ({
      ...module,
      course: courseId
    }));
    return modules;
  }

  function findModuleById(moduleId) {
    return db.modules.find((module) => module._id === moduleId);
  }

  async function createModule(courseId, module) {
    const newModule = { ...module, _id: uuidv4(), course: courseId };
    const result = await model.updateOne({ _id: courseId }, { $push: { modules: newModule } });
    if (result.matchedCount === 0) {
      throw new Error("Course not found");
    }
    return newModule;
  }

  async function updateModule(courseId, moduleId, moduleUpdates) {
    const course = await model.findById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }
    const module = course.modules.id(moduleId);
    if (!module) {
      return null;
    }
    Object.assign(module, moduleUpdates);
    await course.save();
    // Return module with course field
    const updatedModule = module.toObject ? module.toObject() : module;
    return { ...updatedModule, course: courseId };
  }

  async function deleteModule(courseId, moduleId) {
    const result = await model.updateOne({ _id: courseId }, { $pull: { modules: { _id: moduleId } } });
    if (result.matchedCount === 0) {
      throw new Error("Course not found");
    }
    return result.modifiedCount > 0;
  }

  return {
    findModulesForCourse,
    findModuleById,
    createModule,
    updateModule,
    deleteModule,
  };
}

