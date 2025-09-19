const AuthController = require("../controllers/AuthController");

describe("AuthController.logout", () => {
  test("cookies clear test", () => {
    const res = {
      clearCookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const req = {};

    AuthController.logout(req, res);

    expect(res.clearCookie).toHaveBeenCalledWith(
      "refreshToken",
      expect.any(Object)
    );
    expect(res.clearCookie).toHaveBeenCalledWith(
      "accessToken",
      expect.any(Object)
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: "Utilisateur déconnecté avec succès",
    });
  });
});
