const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, required: true },
  surveyResults: { type: Object, default: {} },
  lastModified: { type: Date, required: true },
  creationDate: { type: Date, required: true },
  // responses: [
  //   {
  //     response: { type: Object, required: true },
  //     submittedAt: { type: Date, default: Date.now },
  //   },
  // ],
  responses: [
    {
        response: {

        },
        submittedAt: { type: Date, default: Date.now }
    }
],
  isPublished: { type: Boolean, default: false },
  publicLink: { type: String },

});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;

