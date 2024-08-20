// /backend/models/Project.js
const db = require("../config/db");

const Project = {
  create: (projectData, callback) => {
    const query = "INSERT INTO projects (name, description) VALUES (?, ?)";
    db.query(query, [projectData.name, projectData.description], callback);
  },
  update: (id, projectData, callback) => {
    const query = "UPDATE projects SET name = ?, description = ? WHERE id = ?";
    db.query(query, [projectData.name, projectData.description, id], callback);
  },
  delete: (id, callback) => {
    const query = "DELETE FROM projects WHERE id = ?";
    db.query(query, [id], callback);
  },
  findAll: (callback) => {
    const query = "SELECT * FROM projects";
    db.query(query, callback);
  },
};

module.exports = Project;
