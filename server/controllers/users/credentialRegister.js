const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const prisma = require("../../db");
const convertDocumentToObject = require("../../utils/docToObject");

async function credentialRegister(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new Error("Invalid inputs entered. Please check your data"));
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return next(new Error("The User already exists."));
    }

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password),
      },
    });

    let token;
    try {
      token = jwt.sign({ userId: newUser.id }, process.env.SECRET_TOKEN_KEY, {
        expiresIn: "2h",
      });
    } catch (error) {
      return next(new Error("Registration failed. Please try again"));
    }
    res.set("Cache-Control", "private");

    res.status(201).json({
      ...convertDocumentToObject(newUser),
      image: "NA",
      token: token,
      // Sets time to 2 Hours for THIS application
      expiration: new Date().getTime() + 1000 * 60 * 60 * 2,
    });
  } catch (error) {
    return next(
      new Error(
        "Registration failed. Please check your internet connection and try again"
      )
    );
  }
}

module.exports = credentialRegister;
