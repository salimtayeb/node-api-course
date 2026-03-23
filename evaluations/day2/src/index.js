require("dotenv").config();

const express = require("express");
const authRoutes = require("./routes/auth");
const livresRoutes = require("./routes/livres");
const errorHandler = require("./middlewares/errorHandler");
const config = require("./config/env");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Library Day 2 OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/livres", livresRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route non trouvée"
  });
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Serveur démarré sur http://localhost:${config.port}`);
});
