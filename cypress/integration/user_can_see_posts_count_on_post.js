/* eslint-disable quotes */
describe("Timeline", () => {
  beforeEach(() => {
    cy.task("clearUsers");
    cy.task("clearPosts");
  });

  it("can see likes count on a new post", () => {
    // sign up
    cy.visit("/users/new");
    cy.get("#username").type("anothersomeusername");
    cy.get("#email").type("someone@example.com");
    cy.get("#password").type("pA$sw0rd");
    cy.get("#submit").click();

    // sign in
    cy.visit("/sessions/new");
    cy.get("#email").type("someone@example.com");
    cy.get("#password").type("pA$sw0rd");
    cy.get("#submit").click();

    // submit a post
    cy.visit("/posts");
    cy.contains("New post").click();

    cy.get("#new-post-form").find('[type="submit"]').type("Hello, world!");
    cy.get("#new-post-form").submit();

    cy.get(".posts").should("contain", "Hello, world!");
  });
});
