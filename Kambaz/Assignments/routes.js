import AssignmentsDao from "./dao.js";

export default function AssignmentRoutes(app, db) {
  const dao = AssignmentsDao();

  const findAssignmentsForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const assignments = await dao.findAssignmentsForCourse(courseId);
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching assignments", error: error.message });
    }
  };

  const findAssignmentById = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const assignment = await dao.findAssignmentById(assignmentId);
      if (!assignment) {
        res.status(404).json({ message: "Assignment not found" });
        return;
      }
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ message: "Error fetching assignment", error: error.message });
    }
  };

  const createAssignment = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const newAssignment = await dao.createAssignment(req.body);
      res.json(newAssignment);
    } catch (error) {
      res.status(500).json({ message: "Error creating assignment", error: error.message });
    }
  };

  const updateAssignment = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const { assignmentId } = req.params;
      const updatedAssignment = await dao.updateAssignment(assignmentId, req.body);
      if (!updatedAssignment) {
        res.status(404).json({ message: "Assignment not found" });
        return;
      }
      res.json(updatedAssignment);
    } catch (error) {
      res.status(500).json({ message: "Error updating assignment", error: error.message });
    }
  };

  const deleteAssignment = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const { assignmentId } = req.params;
      const deleted = await dao.deleteAssignment(assignmentId);
      if (!deleted) {
        res.status(404).json({ message: "Assignment not found" });
        return;
      }
      res.json({ message: "Assignment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting assignment", error: error.message });
    }
  };

  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.get("/api/assignments/:assignmentId", findAssignmentById);
  app.post("/api/courses/:courseId/assignments", createAssignment);
  app.put("/api/assignments/:assignmentId", updateAssignment);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
}

