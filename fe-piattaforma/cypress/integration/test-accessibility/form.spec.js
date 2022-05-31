import 'cypress-axe';

export const noLog = { log: false };

import { A11Y_OPTIONS } from '../../support/a11y.setup';
import { ROUTES } from '../../support/constants';

describe('Test accessibilità', () => {
  ROUTES.forEach((route) => {
    context('Pagina ' + route, () => {
      beforeEach(() => {
        cy.customVisitInjectAxe(route);
      });

      it("It's a valid form", function () {
        cy.get('form').within(() => {
          cy.get('input').should('be.visible');
          cy.get('button').should('be.visible');
        });
      });

      it("It's an accessible form", () => {
        cy.checkA11y('form', A11Y_OPTIONS);
        cy.checkA11y('input', A11Y_OPTIONS);
        cy.checkA11y('button', A11Y_OPTIONS);
      });
    });
  });
});
