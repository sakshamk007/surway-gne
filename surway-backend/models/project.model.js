// const mongoose = require('mongoose');

// const projectSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   status: { type: String, required: true },
//   responses: { type: Number, default: 0 },
//   lastModified: { type: String, required: true },
//   creationDate: { type: String, required: true },
//   surveyResults: { type: Object, default: {} },
// });

// const Project = mongoose.model('Project', projectSchema);

// module.exports = Project;

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
            // type: Map, // or an object schema if you want structure
            // of: String, // or other types as needed
        },
        submittedAt: { type: Date, default: Date.now }
    }
],
  isPublished: { type: Boolean, default: false },
  publicLink: { type: String },

});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;

