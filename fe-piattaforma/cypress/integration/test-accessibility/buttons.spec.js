import 'cypress-axe';

export const noLog = { log: false };

import { A11Y_OPTIONS } from '../../support/a11y.setup';
import { ROUTES } from '../../support/constants';

describe('Test bottoni', () => {
  ROUTES.forEach((route) => {
    context('Pagina ' + route, () => {
      beforeEach(() => {
        cy.customVisitInjectAxe(route);
      });

      it('Button A11y', () => {
        cy.checkA11y('button', A11Y_OPTIONS);
      });

      it('No a11y violations after button click', () => {
        cy.get('button')
          .should('be.visible')
          .click({ multiple: true, force: true });
        cy.checkA11y('button', A11Y_OPTIONS);
      });
    });
  });
});
