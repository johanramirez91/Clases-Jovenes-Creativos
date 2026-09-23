import cors from "cors";
import express from "express";
import animes from "./animes.json" with { type: "json" };

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/animes", (req, res) => {
  const { raza, limit } = req.query;
  const numericLimit = limit ? parseInt(limit) : undefined;
  const filteredAnimes =
    raza && tranformarMinuscula(raza)
      ? animes.filter((a) =>
          tranformarMinuscula(a.raza).includes(tranformarMinuscula(raza)),
        )
      : animes;
  if (!filteredAnimes || filteredAnimes.length === 0) {
    return res.status(404).json({ error: "No animes found" });
  }
  res.json(filteredAnimes.slice(0, numericLimit));
});

app.get("/animes/:id", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const animeId = parseInt(req.params.id);
  const anime = animes.find((a) => a.id === animeId);
  if (anime) {
    res.json(anime);
    animes.push(anime);
  } else {
    res.status(404).json({ error: "Anime not found" });
  }
});

app.post("/animes", express.json(), (req, res) => {
  const newAnime = req.body;
  if (!newAnime || !newAnime.id) {
    return res.status(400).json({ error: "Invalid anime data" });
  }
  animes.push(newAnime);
  res.status(201).json(newAnime);
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const tranformarMinuscula = (str) => str.toLowerCase();
