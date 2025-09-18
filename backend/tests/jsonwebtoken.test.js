const jwt = require("jsonwebtoken");
const AuthController = require("../controllers/AuthController");

describe("JSON web token generation", () => {
  const user = { _id: "123", name: "Pawel" };

  beforeAll(() => {
    // Setting of secret values for testing
    process.env.JWT_SECRET = "test_secret";
    process.env.REFRESH_TOKEN_SECRET = "refresh_test_secret";
  });

  // Access Token test
  test("generateAccessToken returns a valid JWT", () => {
    const token = AuthController.generateAccessToken(user);

    // Token verifycation
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    expect(decoded.id).toBe(user._id);
    expect(decoded.name).toBe(user.name);
  });

  // Refresh Token test
  test("generateRefreshToken returns a valid JWT", () => {
    const token = AuthController.generateRefreshToken(user);

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    expect(decoded.id).toBe(user._id);
    expect(decoded.name).toBe(user.name);
  });
});
