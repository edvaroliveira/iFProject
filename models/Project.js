const db = require("../config/db");

const Project = {
  // Criar um novo projeto
  create: (projectData, callback) => {
    const query = `
    INSERT INTO projects (name, description, user_id, created_at, updated_at)
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *;
  `;

    db.query(
      query,
      [projectData.name, projectData.description, projectData.user_id],
      (err, result) => {
        if (err) {
          return callback(err);
        }
        return callback(null, result.rows[0]); // Retorna o projeto criado
      }
    );
  },

  // Atualizar um projeto existente
  update: (id, projectData, callback) => {
    const query = `
      UPDATE projects SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 RETURNING *`;
    db.query(
      query,
      [projectData.name, projectData.description, id],
      (err, result) => {
        if (err) {
          return callback(err);
        }
        return callback(null, result.rows[0]); // Retorna o projeto atualizado
      }
    );
  },

  // Excluir um projeto (soft delete)
  delete: (id, callback) => {
    const query = "DELETE FROM projects WHERE id = $1";
    db.query(query, [id], (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result.rowCount); // Retorna o número de linhas afetadas
    });
  },

  // Buscar todos os projetos
  findAll: (callback) => {
    const query = "SELECT * FROM projects";
    db.query(query, (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result.rows); // Retorna todos os projetos
    });
  },

  // Buscar um projeto específico por ID
  findById: (id, callback) => {
    const query = "SELECT * FROM projects WHERE id = $1";
    db.query(query, [id], (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result.rows[0]); // Retorna o projeto encontrado
    });
  },

  // Buscar todos os projetos com itens agrupados por categoria
  findAllWithItems: (role, userId, callback) => {
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
        WHERE p.user_id = $1
        GROUP BY p.id, i.category
        ORDER BY p.id, i.category;
      `;
      queryParams.push(userId);
    }

    db.query(query, queryParams, (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result.rows); // Retorna os projetos com itens agrupados
    });
  },

  // Buscar projetos de um usuário específico
  getProjectsByUser: (userId, userRole, callback) => {
    let query = "";
    let queryParams = [];

    if (userRole === "admin") {
      query = "SELECT * FROM projects";
    } else {
      query = "SELECT * FROM projects WHERE user_id = $1";
      queryParams.push(userId);
    }

    db.query(query, queryParams, (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result.rows); // Retorna os projetos do usuário
    });
  },
};

module.exports = Project;
