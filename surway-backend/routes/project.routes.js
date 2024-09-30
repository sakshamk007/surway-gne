const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');

// Define project-related routes
router.get('/', projectController.getAllProjects);
router.post('/', projectController.createProject);
router.post('/:id/save-survey', projectController.saveSurveyResults);
router.get('/:id', projectController.getProjectById);

module.exports = router;
