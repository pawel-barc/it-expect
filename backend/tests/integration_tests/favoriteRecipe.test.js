// supertest pèrmet L'envoi des request HTTP à l'API
const request = require("supertest");
// Interne serveur pour imiter la base de données
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const routes = require("../../routes/index");
const User = require("../../models/User");
const Recipe = require("../../models/Recipe");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const express = require("express");
const cookieParser = require("cookie-parser");

// Déclaration des variables
let mongoServer;
let user;
let token;
let app;
let recipe;

process.env.JWT_SECRET = "MySecretCode";

beforeAll(async () => {
  // Initialisation du serveur avec la possibillité de la manipulation d'URL
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use(routes);
  // Création manuel de l'objet user et du token
  user = await User.create({
    name: "Pawel",
    email: "pawel@myemail.gov",
    password: "youWillNeverGuess1?",
  });
  token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET);

  recipe = await Recipe.create({
    user_id: user._id,
    name: "Russians dumplings",
    difficulty: "Difficile",
    category: "Plats",
    cost: "Faible",
    preparation_time: { hours: 2, minutes: 30 },
    steps: [
      { step_number: 1, description: "Pétrir la pâte" },
      { step_number: 2, description: "Façonner les dumplings" },
      { step_number: 3, description: "Faire cuire" },
    ],
    ingredients_and_quantities: [
      { name: "Farine", quantity: "400g" },
      { name: "Fromage blanc", quantity: "200g" },
      { name: "Pomme de terres", quantity: "400g" },
    ],
  });
});
// Déconnexion de la base de donnés et d'ORM
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("FavoriteController integration", () => {
  test("User can add, retrieve and delete favorites", async () => {
    // Ajout aux favoris
    const addRes = await request(app)
      .post("/add-favorite")
      .set("Cookie", [`accessToken=${token}`])
      .send({ recipeId: recipe._id.toString() });

    expect(addRes.statusCode).toBe(201);
    expect(addRes.body.success).toBe("La recette a été ajoutée aux favoris");

    // Récupération des favoris
    const getRes = await request(app)
      .get("/favorites")
      .set("Cookie", [`accessToken=${token}`]);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.favorites).toHaveLength(1);
    expect(getRes.body.favorites[0]._id).toBe(recipe._id.toString());

    // Suppression des favoris
    const deleteRes = await request(app)
      .delete("/delete-favorite")
      .set("Cookie", [`accessToken=${token}`])
      .send({ recipeId: recipe._id.toString() });

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.success).toBe(
      "La recette a été supprimée des favoris avec succès"
    );
    expect(deleteRes.body.favorites).toHaveLength(0);
  });
});
