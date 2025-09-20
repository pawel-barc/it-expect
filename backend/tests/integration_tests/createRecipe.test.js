// supertest pèrmet L'envoi des request HTTP à l'API
const request = require("supertest");
// Interne serveur pour imiter la base de données
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const routes = require("../../routes/index");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const express = require("express");
const cookieParser = require("cookie-parser");

// Déclaration des variables
let mongoServer;
let user;
let token;
let app;

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
});
// Déconnexion de la base de donnés et d'ORM
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("RecipeController integration", () => {
  test("User can successfully add a recipe and retrive it", async () => {
    const newRecipe = {
      user_id: user._id,
      name: "Russians dumplings",
      difficulty: "Difficile",
      category: "Plats",
      cost: "Faible",
      preparation_time: JSON.stringify({ hours: 2, minutes: 30 }),
      steps: JSON.stringify([
        { step_number: 1, description: "Pétrir la pâte" },
        { step_number: 2, description: "Façonner les dumplings" },
        { step_number: 3, description: "Faire cuire" },
      ]),
      ingredients_and_quantities: JSON.stringify([
        { name: "Farine", quantity: "400g" },
        { name: "Fromage blanc", quantity: "200g" },
        { name: "Pomme de terres", quantity: "400g" },
      ]),
    };

    const postRes = await request(app)
      .post("/add-recipe")
      .set("Cookie", [`accessToken=${token}`])
      .send(newRecipe);

    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.recipe.name).toBe("Russians dumplings");

    const getRes = await request(app)
      .get("/user-recipes")
      .set("Cookie", [`accessToken=${token}`]);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.recipes).toHaveLength(1);
    expect(getRes.body.recipes[0].name).toBe("Russians dumplings");
  });
});
