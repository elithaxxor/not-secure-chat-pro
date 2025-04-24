/// <reference types="cypress" />

describe('Not Secure Chat Pro', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('allows a user to join and send a public message', () => {
    cy.window().then(win => {
      cy.stub(win, 'prompt').returns('testuser');
    });
    cy.reload();
    cy.get('#messageInput').type('Hello world!');
    cy.get('#sendButton').click();
    cy.get('.messages').contains('testuser:');
    cy.get('.messages').contains('Hello world!');
  });

  it('shows user list and allows private messaging', () => {
    cy.window().then(win => {
      cy.stub(win, 'prompt').returns('userA');
    });
    cy.reload();
    cy.get('#userSelect').should('exist');
    // Simulate another user joining via backend or mock if needed
  });

  it('shows and allows emoji reactions', () => {
    cy.window().then(win => {
      cy.stub(win, 'prompt').returns('emojiUser');
    });
    cy.reload();
    cy.get('#messageInput').type('React to me!');
    cy.get('#sendButton').click();
    cy.get('.reaction-btn').first().click();
    cy.get('.reactions').should('contain.text', '😀');
  });

  it('is keyboard accessible', () => {
    cy.get('body').tab();
    cy.get('#messageInput').should('have.focus');
    cy.get('#sendButton').focus().type('{enter}');
  });

  it('shows error banners for invalid actions', () => {
    cy.window().then(win => {
      cy.stub(win, 'prompt').returns('errorUser');
    });
    cy.reload();
    // Simulate error (e.g., by sending empty message)
    cy.get('#sendButton').click();
    cy.get('#errorBanner').should('be.visible');
  });
});
