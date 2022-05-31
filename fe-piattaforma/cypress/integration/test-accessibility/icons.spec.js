import 'cypress-axe';

export const noLog = { log: false };

import { A11Y_OPTIONS } from '../../support/a11y.setup';
import { ROUTES } from '../../support/constants';

describe('Test icone', () => {
  ROUTES.forEach((route) => {
    context('Pagina ' + route, () => {
      beforeEach(() => {
        cy.customVisitInjectAxe(route);
      });
      it('Icon A11y', () => {
        cy.checkA11y('svg', A11Y_OPTIONS);
      });
    });
  });
});
