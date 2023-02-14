/* eslint-disable quotes */
describe("Liking post tests", () => {
    beforeEach(() => {
      cy.task("clearUsers");
      cy.task("clearPosts");
    });
  
    it("can like a post", () => {
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

    cy.get('[type="submit"]').contains("New post").click();
    cy.get("#new-post-form").find("textarea").type("Hello, world!");
    cy.get("#new-post-form").submit();
    
      // Assert that we can see the likes count
    cy.get(".posts").should("contain", "0 Likes");
    cy.get('[type="submit"]').contains("Like").click();
    cy.get(".posts").should("contain", "1 Like");
    cy.get('[type="submit"]').contains("Unlike").click();
    cy.get(".posts").should("contain", "0 Likes");
    });


    it("multiple users can like a post", () => {
        // sign up user 1
    cy.visit("/users/new");
    cy.get("#username").type("anotheruser1");
    cy.get("#email").type("someone1@example.com");
    cy.get("#password").type("pA$sw0rd");
    cy.get("#submit").click();

      // sign in
    cy.visit("/sessions/new");
    cy.get("#email").type("someone1@example.com");
    cy.get("#password").type("pA$sw0rd");
    cy.get("#submit").click();

    cy.get('[type="submit"]').contains("New post").click();
    cy.get("#new-post-form").find("textarea").type("Hello, world!");
    cy.get("#new-post-form").submit();

    cy.get(".posts").should("contain", "0 Likes");
    cy.get('[type="submit"]').contains("Like").click();
    cy.get(".posts").should("contain", "1 Like");

    // sign up user 2
    cy.visit("/users/new");
    cy.get("#username").type("anotheruser2");
    cy.get("#email").type("someone2@example.com");
    cy.get("#password").type("pA$sw0rd");
    cy.get("#submit").click();
    
     // sign in
    cy.visit("/sessions/new");
    cy.get("#email").type("someone2@example.com");
    cy.get("#password").type("pA$sw0rd");
    cy.get("#submit").click();

    cy.get(".posts").should("contain", "1 Like");
    cy.get('[type="submit"]').contains("Like").click();
    cy.get(".posts").should("contain", "2 Likes");

    // sign up user 3
    cy.visit("/users/new");
    cy.get("#username").type("anotheruser3");
    cy.get("#email").type("someone3@example.com");
    cy.get("#password").type("pA$sw0rd");
    cy.get("#submit").click();
    
     // sign in
    cy.visit("/sessions/new");
    cy.get("#email").type("someone3@example.com");
    cy.get("#password").type("pA$sw0rd");
    cy.get("#submit").click();

    cy.get(".posts").should("contain", "2 Likes");
    cy.get('[type="submit"]').contains("Like").click();
    cy.get(".posts").should("contain", "3 Likes");
    cy.get('[type="submit"]').contains("Unlike").click();
    cy.get(".posts").should("contain", "2 Likes");
    })
});
//       // submit a post
//       cy.visit("/posts");
//       cy.contains("New post").click();
//       cy.get("#new-post-form").find("textarea").type("Hello, world!");
//       cy.get("#new-post-form").submit();
//       cy.get(".posts").should("contain", "Hello, world!");
//       cy.get(".posts").should("contain", "0 Likes")
//       cy.contains("like").click()
//       cy.get(".posts").should("contain", "1 Like")
//     });
//     it("can submit posts, and add comments when signed in, and view them", () => {
//         // sign up
//         cy.visit("/users/new");
//         cy.get("#username").type("anothersomeusername");
//         cy.get("#email").type("someone@example.com");
//         cy.get("#password").type("pA$sw0rd");
//         cy.get("#submit").click();
//         // sign in
//         cy.visit("/sessions/new");
//         cy.get("#email").type("someone@example.com");
//         cy.get("#password").type("pA$sw0rd");
//         cy.get("#submit").click();
//         // submit a post
//         cy.visit("/posts");
//         cy.contains("New post").click();
//         cy.get("#new-post-form").find("textarea").type("Hello, world!");
//         cy.get("#new-post-form").submit();
//         cy.get(".posts").should("contain", "Hello, world!");
//         cy.contains("comments").click()
//         cy.url().should("include", "/posts/1");
//         cy.get("#comment").type("This is the first comment").type('Cypress.io{enter}')
//         cy.get(".comments").should("contain", "This is the first comment")
//       });
