/// <reference types="cypress" />
import 'cypress-axe';

describe('Accessibility (a11y) checks', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.injectAxe();
  });

  it('has no detectable a11y violations on load', () => {
    cy.checkA11y(null, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa']
      }
    });
  });

  it('has no a11y violations after sending a message', () => {
    cy.window().then(win => {
      cy.stub(win, 'prompt').returns('a11yUser');
    });
    cy.reload();
    cy.get('#messageInput').type('Testing accessibility!');
    cy.get('#sendButton').click();
    cy.checkA11y('.chat-container');
  });
});
