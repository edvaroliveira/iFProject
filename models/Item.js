const db = require("../config/db");

const Item = {
  // Criar um novo item
  create: (itemData, callback) => {
    const query = `
      INSERT INTO items (project_id, category, name, cost, creation_date)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    db.query(
      query,
      [
        itemData.project_id,
        itemData.category,
        itemData.name,
        itemData.cost,
        itemData.creation_date,
      ],
      (err, result) => {
        if (err) {
          return callback(err);
        }
        return callback(null, result.rows[0]); // Retorna o item criado
      }
    );
  },

  // Atualizar um item existente
  update: (id, itemData, callback) => {
    const query = `
      UPDATE items SET category = $1, name = $2, cost = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4 RETURNING *`;
    db.query(
      query,
      [itemData.category, itemData.name, itemData.cost, id],
      (err, result) => {
        if (err) {
          return callback(err);
        }
        return callback(null, result.rows[0]); // Retorna o item atualizado
      }
    );
  },

  // Excluir (soft delete) um item
  delete: (id, callback) => {
    const query = "UPDATE items SET deleted = TRUE WHERE id = $1 RETURNING *";
    db.query(query, [id], (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result.rows[0]); // Retorna o item excluído
    });
  },

  // Buscar todos os itens de um projeto específico (excluindo itens deletados)
  findByProject: (projectId, callback) => {
    const query =
      "SELECT * FROM items WHERE project_id = $1 AND deleted = FALSE";
    db.query(query, [projectId], (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result.rows); // Retorna os itens do projeto
    });
  },

  // Adicionar múltiplos itens a um projeto
  addItemsToProject: (projectId, items, callback) => {
    const values = items.map((item) => [
      item.name,
      item.category,
      item.cost,
      projectId,
      item.creation_date,
      new Date(),
      new Date(),
    ]);

    const query = `
      INSERT INTO items (name, category, cost, project_id, creation_date, created_at, updated_at)
      VALUES ${values
        .map(
          (_, i) =>
            `($${i * 7 + 1}, $${i * 7 + 2}, $${i * 7 + 3}, $${i * 7 + 4}, $${
              i * 7 + 5
            }, $${i * 7 + 6}, $${i * 7 + 7})`
        )
        .join(", ")}
      RETURNING *`;

    db.query(query, [].concat(...values), (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result.rows); // Retorna os itens adicionados
    });
  },
};

module.exports = Item;
