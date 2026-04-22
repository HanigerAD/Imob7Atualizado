const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(cors());

app.listen(PORT, () => {
  console.log("CDN conectado na porta:", PORT);
});
