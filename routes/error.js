const express = require("express");
const path = require("path");
const router = express.Router();

router.use((req, res) => {
  res.status(200).render(path.join(__dirname, "../pages/error.ejs"));
});
module.exports = router;
