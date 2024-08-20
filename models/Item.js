// /backend/models/Item.js
const db = require("../config/db");

const Item = {
  create: (itemData, callback) => {
    const query =
      "INSERT INTO items (projectId, category, name, cost) VALUES (?, ?, ?, ?)";
    db.query(
      query,
      [itemData.projectId, itemData.category, itemData.name, itemData.cost],
      callback
    );
  },
  update: (id, itemData, callback) => {
    const query =
      "UPDATE items SET category = ?, name = ?, cost = ? WHERE id = ?";
    db.query(
      query,
      [itemData.category, itemData.name, itemData.cost, id],
      callback
    );
  },
  delete: (id, callback) => {
    const query = "UPDATE items SET deleted = 1 WHERE id = ?";
    db.query(query, [id], callback);
  },
  findByProject: (projectId, callback) => {
    const query = "SELECT * FROM items WHERE projectId = ? AND deleted = 0";
    db.query(query, [projectId], callback);
  },
};

module.exports = Item;
