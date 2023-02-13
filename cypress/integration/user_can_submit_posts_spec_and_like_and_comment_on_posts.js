/* eslint-disable quotes */
// describe("Timeline", () => {
//     beforeEach(() => {
//       cy.task("clearUsers");
//     });
  
//     it("can submit posts, and like them when signed in, and view them", () => {
//       // sign up
//       cy.visit("/users/new");
//       cy.get("#username").type("anothersomeusername");
//       cy.get("#email").type("someone@example.com");
//       cy.get("#password").type("pA$sw0rd");
//       cy.get("#submit").click();
  
//       // sign in
//       cy.visit("/sessions/new");
//       cy.get("#email").type("someone@example.com");
//       cy.get("#password").type("pA$sw0rd");
//       cy.get("#submit").click();
  
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
//   });