const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/surway', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const projectSchema = new mongoose.Schema({
  name: String,
  status: String,
  responses: Number,
  lastModified: String,
  creationDate: String,
});

const Project = mongoose.model('Project', projectSchema);

app.get('/api/projects', async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

app.post('/api/projects', async (req, res) => {
  const { name, status, responses, lastModified, creationDate } = req.body;
  const newProject = new Project({ name, status, responses, lastModified, creationDate });
  await newProject.save();
  res.json(newProject);
});

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
