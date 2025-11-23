import { v4 as uuidv4 } from "uuid";

export default function ModulesDao(db) {
  function findModulesForCourse(courseId) {
    return db.modules.filter((module) => module.course === courseId);
  }

  function findModuleById(moduleId) {
    return db.modules.find((module) => module._id === moduleId);
  }

  function createModule(courseId, module) {
    const newModule = { ...module, _id: uuidv4(), course: courseId };
    db.modules = [...db.modules, newModule];
    return newModule;
  }

  function updateModule(moduleId, moduleUpdates) {
    const moduleIndex = db.modules.findIndex((module) => module._id === moduleId);
    if (moduleIndex === -1) {
      return null;
    }
    db.modules[moduleIndex] = { ...db.modules[moduleIndex], ...moduleUpdates };
    return db.modules[moduleIndex];
  }

  function deleteModule(moduleId) {
    const moduleIndex = db.modules.findIndex((module) => module._id === moduleId);
    if (moduleIndex === -1) {
      return false;
    }
    db.modules = db.modules.filter((module) => module._id !== moduleId);
    return true;
  }

  return {
    findModulesForCourse,
    findModuleById,
    createModule,
    updateModule,
    deleteModule,
  };
}

