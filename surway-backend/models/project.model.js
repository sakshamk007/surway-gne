const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, required: true },
  responses: { type: Number, default: 0 },
  lastModified: { type: String, required: true },
  creationDate: { type: String, required: true },
  surveyResults: { type: Object, default: {} },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
