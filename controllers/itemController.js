const Item = require("../models/Item");

// Criar um novo item
exports.create = (req, res) => {
  const { projectId, category, name, cost, creation_date } = req.body;

  if (!projectId || !category || !name || !cost || !creation_date) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  Item.create(
    { project_id: projectId, category, name, cost, creation_date },
    (err, item) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erro ao criar o item.", error: err });
      }
      res.status(201).json({ message: "Item criado com sucesso!", item });
    }
  );
};

// Atualizar um item existente
exports.update = (req, res) => {
  const { id } = req.params;
  const { category, name, cost } = req.body;

  if (!category || !name || !cost) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  Item.update(id, { category, name, cost }, (err, item) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao atualizar o item.", error: err });
    }
    if (!item) {
      return res.status(404).json({ message: "Item não encontrado." });
    }
    res.status(200).json({ message: "Item atualizado com sucesso!", item });
  });
};

// Excluir um item (soft delete)
exports.delete = (req, res) => {
  const { id } = req.params;

  Item.delete(id, (err, item) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao excluir o item.", error: err });
    }
    if (!item) {
      return res.status(404).json({ message: "Item não encontrado." });
    }
    res.status(200).json({ message: "Item excluído com sucesso!", item });
  });
};

// Buscar todos os itens de um projeto específico
exports.findAllByProject = (req, res) => {
  const { projectId } = req.params;

  Item.findByProject(projectId, (err, items) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar os itens.", error: err });
    }
    res.status(200).json(items);
  });
};

// Adicionar múltiplos itens a um projeto
exports.addItemsToProject = (req, res) => {
  const { projectId } = req.params;
  const { items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Nenhum item foi enviado." });
  }

  Item.addItemsToProject(projectId, items, (err, addedItems) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao adicionar itens ao projeto.", error: err });
    }
    res
      .status(201)
      .json({ message: "Itens adicionados com sucesso!", items: addedItems });
  });
};
