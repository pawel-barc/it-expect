const AuthController = require("../controllers/AuthController");
const RecipeController = require("../controllers/RecipeController");
const Recipe = require("../models/Recipe");

jest.mock("../models/Recipe");

describe("RecipeController.getUserRecipes", () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: "1" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("should return recipes of connected user", async () => {
    const fakeRecipes = [{ name: "Fondue" }, { name: "Tartiflette" }];
    Recipe.find.mockResolvedValue(fakeRecipes);

    await RecipeController.getUserRecipes(req, res);

    expect(Recipe.find).toHaveBeenCalledWith({ user_id: "1" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: "Recettes de l'utilisateur récupérées avec succès",
      recipes: fakeRecipes,
    });
  });
});
