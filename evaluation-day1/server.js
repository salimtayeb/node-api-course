const http = require("http");
const router = require("./modules/router");

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  res.on("finish", () => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} → ${res.statusCode}`);
  });

  await router(req, res);
});

server.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
