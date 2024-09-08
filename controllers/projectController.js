const Project = require("../models/Project");

// Cria um novo projeto
exports.create = (req, res) => {
  const { name, description } = req.body;
  const userId = req.body.user_id;
  console.log(userId);

  if (!name) {
    return res
      .status(400)
      .json({ message: "O nome do projeto é obrigatório." });
  }

  Project.create({ name, description, user_id: userId }, (err, project) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao criar o projeto.", error: err });
    }
    res
      .status(201)
      .json({ message: "Projeto criado com sucesso!", projectId: project.id });
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

  Project.update(id, { name, description }, (err, project) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao atualizar o projeto.", error: err });
    }
    if (!project) {
      return res.status(404).json({ message: "Projeto não encontrado." });
    }
    res.status(200).json({ message: "Projeto atualizado com sucesso!" });
  });
};

// Exclui um projeto (soft delete)
exports.delete = (req, res) => {
  const { id } = req.params;

  Project.delete(id, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao excluir o projeto.", error: err });
    }
    if (result === 0) {
      return res.status(404).json({ message: "Projeto não encontrado." });
    }
    res.status(200).json({ message: "Projeto excluído com sucesso!" });
  });
};

// Lista todos os projetos
exports.findAll = (req, res) => {
  Project.findAll((err, projects) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar os projetos.", error: err });
    }
    res.status(200).json(projects);
  });
};

// Busca um projeto específico com seus itens
exports.findById = (req, res) => {
  const { id } = req.params;

  Project.findById(id, (err, project) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar o projeto.", error: err });
    }
    if (!project) {
      return res.status(404).json({ message: "Projeto não encontrado." });
    }
    res.status(200).json(project);
  });
};

// Lista todos os projetos com seus itens
exports.findAllWithItems = (req, res) => {
  const role = req.query.role;
  const userId = req.user.id;

  Project.findAllWithItems(role, userId, (err, projects) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar os projetos e itens.", error: err });
    }
    res.status(200).json(projects);
  });
};

// Retorna os projetos do usuário (ou todos se admin)
exports.getProjectsByUser = (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  Project.getProjectsByUser(userId, userRole, (err, projects) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar projetos.", error: err });
    }
    res.status(200).json(projects);
  });
};
