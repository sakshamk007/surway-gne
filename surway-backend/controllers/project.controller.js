const Project = require('../models/project.model');

// Controller to get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to create a new project
exports.createProject = async (req, res) => {
  const { name, status, responses, lastModified, creationDate } = req.body;
  const newProject = new Project({
    name,
    status,
    responses,
    lastModified,
    creationDate,
  });
  try {
    await newProject.save();
    res.json(newProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.saveSurveyResults = async (req, res) => {
  
  const projectId = req.params.id;
    const surveyData = req.body.surveyJSON;

    try {
        // Assuming you have a method to find the project and update it
        const project = await Project.findByIdAndUpdate(projectId, { surveyResults: surveyData, lastModified: new Date().toISOString() }, { new: true });
        res.status(200).json({ message: "Survey saved successfully", project });
    } catch (error) {
        console.error("Error saving survey:", error);
        res.status(500).json({ error: "Failed to save survey" });
    }
};


// Controller to get a project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
