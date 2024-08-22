// /backend/controllers/itemController.js

const db = require("../config/db");

exports.create = (req, res) => {
  const { projectId, category, name, cost } = req.body;

  if (!projectId || !category || !name || !cost) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  const query =
    "INSERT INTO items (project_id, category, name, cost) VALUES (?, ?, ?, ?)";
  db.query(query, [projectId, category, name, cost], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao criar o item.", error: err });
    }
    res
      .status(201)
      .json({ message: "Item criado com sucesso!", itemId: result.insertId });
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { category, name, cost } = req.body;

  if (!category || !name || !cost) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  const query =
    "UPDATE items SET category = ?, name = ?, cost = ? WHERE id = ?";
  db.query(query, [category, name, cost, id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao atualizar o item.", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item não encontrado." });
    }

    res.status(200).json({ message: "Item atualizado com sucesso!" });
  });
};

exports.delete = (req, res) => {
  const { id } = req.params;

  const checkQuery = "SELECT * FROM items WHERE id = ?";
  db.query(checkQuery, [id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao verificar o item.", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Item não encontrado." });
    }

    const deleteQuery = "UPDATE items SET deleted = 1 WHERE id = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erro ao excluir o item.", error: err });
      }
      res.status(200).json({ message: "Item excluído com sucesso!" });
    });
  });
};

exports.findAllByProject = (req, res) => {
  const { projectId } = req.params;

  const query = "SELECT * FROM items WHERE project_id = ? AND deleted = 0";
  db.query(query, [projectId], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar os itens.", error: err });
    }
    res.status(200).json(results);
  });
};

// /backend/controllers/itemController.js

exports.addItemsToProject = (req, res) => {
  const { projectId } = req.params;
  const { items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Nenhum item foi enviado." });
  }

  const insertValues = items.map((item) => [
    item.name,
    item.category,
    item.cost,
    projectId,
    item.creation_date, // Inclui a data de criação específica
    new Date(),
    new Date(),
  ]);

  const query = `
  INSERT INTO items (name, category, cost, project_id, creation_date, created_at, updated_at)
  VALUES ?
`;

  db.query(query, [insertValues], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao adicionar itens ao projeto.", error: err });
    }
    res.status(201).json({ message: "Itens adicionados com sucesso!" });
  });
};

exports.getItemsByProject = (req, res) => {
  const { projectId } = req.params;

  const query = "SELECT * FROM items WHERE project_id = ?";

  db.query(query, [projectId], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar itens do projeto.", error: err });
    }
    res.status(200).json(results);
  });
};
