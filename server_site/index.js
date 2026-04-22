const path = require("path");
const express = require("express");

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.static(path.resolve(__dirname, "public")));

app.use("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log("Site conectado na porta:", PORT);
});
