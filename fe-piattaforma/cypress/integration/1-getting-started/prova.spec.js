import 'cypress-axe';

export const noLog = { log: false };

import { A11Y_OPTIONS } from '../../support/a11y.setup';

context('header behaves correctly', () => {
  beforeEach(() => {
    cy.customVisitInjectAxe('/area-amministrativa/programmi');
    cy.viewport(1400, 900);
  });

  it('search should be visible', () => {
    cy.get('#search').should('be.visible');
    cy.checkA11y(null, A11Y_OPTIONS);
  });
  it('title is visible', () => {
    cy.contains('Programmi').then(($el) => cy.wrap($el).should('be.visible'));
  });
  it('button exists', () => {
    cy.get('[data-testid=create-new-element]')
      .find('button')
      .should('be.visible');
  });
});
