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
