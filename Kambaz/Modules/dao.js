import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
export default function ModulesDao(db) {
  async function findModulesForCourse(courseId) {
    const course = await model.findById(courseId);
    return course.modules;
  }

  function findModuleById(moduleId) {
    return db.modules.find((module) => module._id === moduleId);
  }

  async function createModule(courseId, module) {
    const newModule = { ...module, _id: uuidv4() };
    const status = await model.updateOne({ _id: courseId }, { $push: { modules: newModule } });
    return newModule;
  }

  async function updateModule(courseId, moduleId, moduleUpdates) {
    const course = await model.findById(courseId);
    const module = course.modules.id(moduleId);
    Object.assign(module, moduleUpdates);
    await course.save();
    return module;
  }

  async function deleteModule(courseId, moduleId) {
    const status = await model.updateOne({ _id: courseId }, { $pull: { modules: { _id: moduleId } } });
   return status;
  }

  return {
    findModulesForCourse,
    findModuleById,
    createModule,
    updateModule,
    deleteModule,
  };
}

