const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");

dotenv.config();

const homeRoutes = require("./routes/home");
const contactRoutes = require("./routes/contact");
const errorRoutes = require("./routes/error");

app.use(express.json());

mongoose
  .connect(process.env.URL_DATABASE)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log(`${error}`));

app.use("/images", express.static(`${__dirname}/Public/images`)); // pour configurer les fichiers statiques, a mettre avant la route
app.use("/styles", express.static(`${__dirname}/Public/styles/`));

app.use((req, res, next) => {
  // a placer avant la route
  console.log(new Date().toLocaleDateString());
  next();
});

app.use(morgan("dev")); // mettre avant la route

app.use(homeRoutes);
app.use(contactRoutes);
app.use(errorRoutes);
// la route

app.listen(process.env.PORT || 3000, () => {
  console.log(`Le serveur est disponible à l'adresse :
    http://${process.env.HOST}:${process.env.PORT ? process.env.PORT : 3000}`);
});
