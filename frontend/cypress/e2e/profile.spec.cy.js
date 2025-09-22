describe("Profile E2E Tests with existing user", () => {
  const userEmail = "clint@est.wood";
  const userPassword = "11MMmm!!";

  // Avant chaque test on connecte l'utilisateur
  beforeEach(() => {
    cy.session("user", () => {
      // Aller sur la page de connexion et saisir les identifiants
      cy.visit("/login");
      cy.get("[data-cy=email-input]").type(userEmail);
      cy.get("[data-cy=password-input]").type(userPassword);
      cy.get("[data-cy=login-button]").click();
      cy.url().should("include", "/profile");
    });
  });

  it("loads the profile correctly", () => {
    // Vérifie que les informations du profil sont bien chargées
    cy.visit("/profile");
    // Vérifier que les champs contiennt les bonnes valleurs
    cy.get("[data-cy=name-input]").should("have.value", "Paul");
    cy.get("[data-cy=email-input]").should("have.value", userEmail);
  });

  it("updates profile information", () => {
    // Verifie la mis à jour du nom d'utilisateur
    cy.visit("/profile");
    // Le nom Paul Updated
    cy.get("[data-cy=name-input]").clear().type("Paul Updated");
    cy.get("[data-cy=update-button]").click();
    cy.contains("Le profil mis à jour avec succès !");
  });

  it("shows error when password is invalid", () => {
    cy.visit("http://localhost:5173/profile");

    // Cas nr 1 : Le mot de passe trop court
    cy.get("[data-cy=password-input]").type("123");
    cy.get("[data-cy=repeat-password-input]").type("123");
    cy.get("[data-cy=update-button]").click();

    cy.get(".error").should("contain", "caract").and("be.visible");

    // Cas nr 2 : Le mots de passes ne correspondent pas
    cy.get("[data-cy=password-input]").clear().type("ValidPass123!");
    cy.get("[data-cy=repeat-password-input]").clear().type("DifferentPass!");
    cy.get("[data-cy=update-button]").click();

    cy.get(".error").should("contain", "correspond").and("be.visible");
  });
});
