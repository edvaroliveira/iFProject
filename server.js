// /backend/server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const itemRoutes = require("./routes/itemRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/items", itemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
