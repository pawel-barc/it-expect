const {
  validateEmail,
  validateLength,
  validatePassword,
} = require("../utils/validator");

describe("Validator utils", () => {
  // Email test
  test("valide email correct", () => {
    expect(validateEmail("pawel@exapmle.com")).toBe(true);
  });
  test("refuse email incorrect", () => {
    expect(validateEmail("invalid-email")).toBe(false);
  });

  // Length test
  test("validate length correct", () => {
    expect(validateLength("aaa", 3)).toBe(true);
  });
  test("rejects to short length", () => {
    expect(validateLength("a", 3)).toBe(false);
  });

  // Password test
  test("validate password correct", () => {
    expect(validatePassword("Password1!")).toBe(true);
  });
  test("rejects password without digits", () => {
    expect(validatePassword("PassNoDigit!")).toBe(false);
  });
});
