const { readDB, writeDB } = require("./db");

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        const parsedBody = JSON.parse(body);
        resolve(parsedBody);
      } catch (error) {
        reject(new Error("JSON invalide"));
      }
    });

    req.on("error", () => {
      reject(new Error("Erreur lors de la lecture du body"));
    });
  });
}

async function router(req, res) {
  try {
    const url = new URL(req.url, "http://localhost:3000");
    const pathname = url.pathname;
    const method = req.method;

    if (pathname === "/books" && method === "GET") {
      const db = await readDB();
      let books = db.books;

      const availableQuery = url.searchParams.get("available");
      if (availableQuery !== null) {
        const isAvailable = availableQuery === "true";
        books = books.filter((book) => book.available === isAvailable);
      }

      return sendJson(res, 200, {
        success: true,
        count: books.length,
        data: books
      });
    }

    if (pathname.startsWith("/books/") && method === "GET") {
      const id = parseInt(pathname.split("/")[2], 10);

      if (Number.isNaN(id)) {
        return sendJson(res, 404, {
          success: false,
          error: "Livre introuvable"
        });
      }

      const db = await readDB();
      const book = db.books.find((item) => item.id === id);

      if (!book) {
        return sendJson(res, 404, {
          success: false,
          error: "Livre introuvable"
        });
      }

      return sendJson(res, 200, {
        success: true,
        data: book
      });
    }

    if (pathname === "/books" && method === "POST") {
      const body = await getRequestBody(req);
      const { title, author, year } = body;

      if (!title || !author || year === undefined) {
        return sendJson(res, 400, {
          success: false,
          error: "Les champs title, author et year sont requis"
        });
      }

      const db = await readDB();
      const books = db.books;
      const maxId = books.length > 0 ? Math.max(...books.map((book) => book.id)) : 0;

      const newBook = {
        id: maxId + 1,
        title,
        author,
        year,
        available: true
      };

      books.push(newBook);
      await writeDB(db);

      return sendJson(res, 201, {
        success: true,
        data: newBook
      });
    }

    if (pathname.startsWith("/books/") && method === "DELETE") {
      const id = parseInt(pathname.split("/")[2], 10);

      if (Number.isNaN(id)) {
        return sendJson(res, 404, {
          success: false,
          error: "Livre introuvable"
        });
      }

      const db = await readDB();
      const index = db.books.findIndex((book) => book.id === id);

      if (index === -1) {
        return sendJson(res, 404, {
          success: false,
          error: "Livre introuvable"
        });
      }

      const deletedBook = db.books[index];
      db.books.splice(index, 1);
      await writeDB(db);

      return sendJson(res, 200, {
        success: true,
        data: deletedBook
      });
    }

    return sendJson(res, 404, {
      success: false,
      error: "Route non trouvée"
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      error: "Erreur interne"
    });
  }
}

module.exports = router;
