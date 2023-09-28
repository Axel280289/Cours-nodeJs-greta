const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/", (req, res) => {
  const hello = "Bonjour";
  const year = 2023;
  res.status(200).render(path.join(__dirname, "../index.ejs"), { hello, year });
});
module.exports = router;
