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

// Controller to get survey JSON for respondents (without auth)
exports.getSurveyForRespondent = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Survey not found" });
    }
    res.json(project.surveyResults); // Only send survey JSON
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to save survey responses from respondents
exports.submitSurveyResponse = async (req, res) => {
  const projectId = req.params.id;
  const surveyResponse = req.body.responses;

  console.log("Survey response received:", surveyResponse); // Log the received survey response

  if (typeof surveyResponse !== 'object' || surveyResponse === null) {
      return res.status(400).json({ error: "Invalid survey response format" });
  }

  try {
      const project = await Project.findById(projectId);
      if (!project) {
          return res.status(404).json({ message: "Survey not found" });
      }

      // Ensure each response is structured as an object
      project.responses.push({
          response: surveyResponse, // This is the survey response data
          submittedAt: new Date(),
      });

      await project.save();

      res.status(200).json({ message: "Response submitted successfully" });
  } catch (error) {
      console.error("Error saving response:", error);
      res.status(500).json({ error: "Failed to save response" });
  }
};




// Controller to publish survey and generate a shareable link
exports.publishSurvey = async (req, res) => {
  const projectId = req.params.id;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if already published
    if (project.isPublished) {
      return res.status(200).json({ message: "Survey is already published", publicLink: project.publicLink });
    }

    // Generate public link
    const publicLink = `https://surway-gne.onrender.com/survey/${projectId}`;
    project.isPublished = true;
    project.publicLink = publicLink;
    await project.save();

    res.status(200).json({ message: "Survey published successfully", publicLink });
  } catch (error) {
    console.error("Error publishing survey:", error);
    res.status(500).json({ error: "Failed to publish survey" });
  }
};
