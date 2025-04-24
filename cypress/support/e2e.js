// Custom commands and global before/after hooks for Cypress
defineCypressKeyboardTab();

function defineCypressKeyboardTab() {
  Cypress.Commands.add('tab', { prevSubject: 'element' }, (subject) => {
    cy.wrap(subject).trigger('keydown', { keyCode: 9, which: 9 });
  });
}
