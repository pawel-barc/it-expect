// supertest pèrmet L'envoi des request HTTP à l'API
const request = require("supertest");
// Interne serveur pour imiter la base de données
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const routes = require("../../routes/index");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const express = require("express");
const cookieParser = require("cookie-parser");

// Déclaration des variables
let mongoServer;
let user;
let app;

process.env.JWT_SECRET = "MySecretCode";
process.env.REFRESH_TOKEN_SECRET = "MyRefreshCode";

beforeAll(async () => {
  // Initialisation du serveur avec la possibillité de la manipulation d'URL
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use(routes);
  // Création manuel d'un utilisateur existant
  const hashedPassword = await bcryptjs.hash("YouWillNeverGuess1!", 10);
  user = await User.create({
    name: "Pawel",
    email: "pawel@myemail.gov",
    password: hashedPassword,
  });
});
// Déconnexion de la base de donnés et d'ORM
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("AuthController integration login", () => {
  // L'utilisateur entre le mot de passe incorrect
  test("Login failure after user enter a wrong password ", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "pawel@myemail.gov", password: "IWillNeverGuess1!" });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Email ou mot de passe incorrect");
  });

  // L'utilisateur entre les identifiants corrects
  test("Login success after user enter correct login data ", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "pawel@myemail.gov", password: "YouWillNeverGuess1!" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe("Utilisateur connecté");
    expect(res.body.user.email).toBe("pawel@myemail.gov");
    expect(res.headers["set-cookie"]).toBeDefined();
  });
});
