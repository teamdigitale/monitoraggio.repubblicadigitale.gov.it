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
      it('A11y', () => {
        cy.checkA11y(null, A11Y_OPTIONS);
      });
    });
  });
});
