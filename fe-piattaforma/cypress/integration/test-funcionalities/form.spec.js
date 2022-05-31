import 'cypress-axe';

export const noLog = { log: false };

import { A11Y_OPTIONS } from '../../support/a11y.setup';

context('Pagina programs', () => {
  beforeEach(() => {
    cy.customVisitInjectAxe('/area-amministrativa/programmi');
  });

  it('Form after click button', () => {
    cy.get('[data-testid=create-new-entity]')
      .should('be.visible')
      .click({ multiple: true, force: true });

    cy.get('#programName').should('be.visible').type('John Doe');
    // cy.get('#react-select-2-input').should('exist').click({ force: true }).type('RFD');
    cy.get('#startDate').should('be.visible').type('2022-10-09');
    cy.get('#endDate').should('be.visible').type('2022-11-10');
    cy.checkA11y('form', A11Y_OPTIONS);
  });
});
