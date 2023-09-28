const AddressUser = require("../models/AddressUser");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

const verifInputs = (req, res) => {
  body("lastname", "Le nom est obligatoire").isString().notEmpty();
  body("firstname", "Le prénom est obligatoire").isString().notEmpty();
  body("email", "L'email obligatoire").isString().notEmpty();
  body("password", "Le mot de passe est obligatoire").isString().notEmpty();
  body("passwordConfirm", "La confirmation du mot de passe est obligatoire")
    .isString()
    .notEmpty();
  body("street", "le numéro et nom de voie est obligatoire")
    .isString()
    .notEmpty();
  body("zipcode", "le code postal est obligatoire").isString().notEmpty();
  body("city", "la ville est obligatoire").isString().notEmpty();

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
};

const findUserByMail = async (req) => {
  return await User.findOne({ email: req.body.email });
};

const findAddress = async (req) => {
  return await AddressUser.findOne({
    street: req.body.street,
    zipcode: req.body.zipcode,
    city: req.body.city,
  });
};

const createAddress = async (req) => {
  const newAddress = new AddressUser({
    street: req.body.street,
    zipcode: req.body.zipcode,
    city: req.body.city,
  });
  return await newAddress.save();
};

const newUser = async (idAddress, req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: hash,
    birth: new Date(req.body.birth),
    address: idAddress,
  });

  user
    .save()
    .then((result) => {
      res.status(200).json({ message: result });
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};

exports.createUser = (req, res) => {
  try {
    verifInputs(req, res);

    findUserByMail(req)
      .then((user) => {
        if (user) {
          return res.status(409).json({ message: "user already exists" });
        } else {
          findAddress(req)
            .then((address) => {
              if (address) {
                newUser(address.id, req, res);
              } else {
                createAddress(req)
                  .then((result) => {
                    newUser(result.id, req, res);
                  })
                  .catch((error) => {
                    console.log("Erreur createAddress", error);
                  });
              }
            })
            .catch((error) => {
              console.log("Erreur,findAddress", error);
              res.status(500).json({ error: error });
            });
        }
      })
      .catch((error) => {
        console.log("Erreur,findUserByMail", error);
        res.status(500).json({ error: error });
      });
  } catch (error) {
    console.log("try error", error);
  }
};

exports.createUser = () => {};
exports.getUsers = () => {};
exports.getUserById = () => {};
exports.updateUser = () => {};
exports.deleteUser = () => {};
