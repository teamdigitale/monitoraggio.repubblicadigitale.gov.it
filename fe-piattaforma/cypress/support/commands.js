// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import { noLog } from './a11y.setup';

Cypress.Commands.add('customVisit', (route, tWait = 200) => {
  cy.visit(route, noLog);
  cy.wait(tWait);
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });
});

Cypress.Commands.add('customVisitInjectAxe', (route, mobile = false) => {
  if (mobile) {
    cy.viewport(320, 900);
  } else {
    cy.viewport(1400, 900);
  }
  cy.customVisit(route);
  cy.injectAxe();
  cy.configureAxe({
    reporter: 'v2',
    iframes: true,
  });
});
