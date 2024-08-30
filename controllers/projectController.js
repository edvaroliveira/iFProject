// /backend/controllers/projectController.js

const Project = require("../models/Project");
const Item = require("../models/Item");
const db = require("../config/db");

// Cria um novo projeto
exports.create = (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id;

  if (!name) {
    return res
      .status(400)
      .json({ message: "O nome do projeto é obrigatório." });
  }

  const query = `
    INSERT INTO projects (name, description, user_id, created_at, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `;

  db.query(query, [name, description, userId], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao criar o projeto.", error: err });
    }
    res.status(201).json({
      message: "Projeto criado com sucesso!",
      projectId: result.insertId,
    });
  });
};

// Atualiza um projeto existente
exports.update = (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ message: "O nome do projeto é obrigatório." });
  }

  const query = `
    UPDATE projects
    SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.query(query, [name, description, id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao atualizar o projeto.", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Projeto não encontrado." });
    }

    res.status(200).json({ message: "Projeto atualizado com sucesso!" });
  });
};

// Exclui um projeto (soft delete)
exports.delete = (req, res) => {
  const { id } = req.params;

  // Verifica se o projeto existe
  const checkQuery = "SELECT * FROM projects WHERE id = ?";
  db.query(checkQuery, [id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao verificar o projeto.", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Projeto não encontrado." });
    }

    // Exclui o projeto (ou implementa soft delete)
    const deleteQuery = "DELETE FROM projects WHERE id = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erro ao excluir o projeto.", error: err });
      }
      res.status(200).json({ message: "Projeto excluído com sucesso!" });
    });
  });
};

// Lista todos os projetos
exports.findAll = (req, res) => {
  const query = "SELECT * FROM projects";
  db.query(query, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar os projetos.", error: err });
    }
    res.status(200).json(results);
  });
};

// Busca um projeto específico com seus itens
exports.findById = (req, res) => {
  const { id } = req.params;

  const projectQuery = "SELECT * FROM projects WHERE id = ?";
  db.query(projectQuery, [id], (err, projectResults) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar o projeto.", error: err });
    }

    if (projectResults.length === 0) {
      return res.status(404).json({ message: "Projeto não encontrado." });
    }

    const itemsQuery =
      "SELECT * FROM items WHERE project_id = ? AND deleted = 0";
    db.query(itemsQuery, [id], (err, itemResults) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erro ao buscar os itens do projeto.", error: err });
      }

      const project = projectResults[0];
      project.items = itemResults;

      res.status(200).json(project);
    });
  });
};

// Lista todos os projetos com seus itens
exports.findAllWithItems = (req, res) => {
  const role = req.query.role;
  const userId = req.user.id;
  console.log("userID", userId);
  console.log("role", role);

  console.log("Foiiiiii");

  let query = "";
  let queryParams = [];

  if (role === "admin") {
    query = `
      SELECT
        p.id as projectId, p.name as projectName, p.description as projectDescription,
        i.category as itemCategory, SUM(i.cost) as totalCost
      FROM projects p
      LEFT JOIN items i ON p.id = i.project_id
      GROUP BY p.id, i.category
      ORDER BY p.id, i.category;
    `;
  } else {
    query = `
      SELECT
        p.id as projectId, p.name as projectName, p.description as projectDescription,
        i.category as itemCategory, SUM(i.cost) as totalCost
      FROM projects p
      LEFT JOIN items i ON p.id = i.project_id
      WHERE p.user_id = ?
      GROUP BY p.id, i.category
      ORDER BY p.id, i.category;
    `;
    queryParams.push(userId);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar os projetos e itens.", error: err });
    }

    const projects = results.reduce((acc, row) => {
      let project = acc.find((p) => p.id === row.projectId);
      if (!project) {
        project = {
          id: row.projectId,
          name: row.projectName,
          description: row.projectDescription,
          items: [],
        };
        acc.push(project);
      }
      if (row.itemCategory) {
        project.items.push({
          category: row.itemCategory,
          cost: row.totalCost,
        });
      }
      return acc;
    }, []);

    res.status(200).json(projects);
  });
};

exports.getProjectsByUser = (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  let query = "";
  let queryParams = [];

  if (userRole === "admin") {
    // Se o usuário for admin, retorna todos os projetos
    query = "SELECT * FROM projects";
  } else {
    // Se o usuário não for admin, retorna apenas os projetos associados ao usuário
    query = "SELECT * FROM projects WHERE user_id = ?";
    queryParams.push(userId);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar projetos.", error: err });
    }
    res.status(200).json(results);
  });
};
