/// <reference types="cypress" />

describe('Admin Controls & Multi-User Simulation', () => {
  it('admin can mute, kick, and ban another user', () => {
    // Open first window as admin
    cy.visit('http://localhost:3000', {
      onBeforeLoad(win) {
        cy.stub(win, 'prompt').returns('adminUser');
      }
    });
    // Wait for user list to appear
    cy.get('#userSelect');

    // Open second window as regular user
    cy.origin('http://localhost:3000', { args: {} }, () => {
      window.open('http://localhost:3000', '_blank');
    });
    // Cypress limitation: multi-tab simulation is limited, but we can mock backend/user list for demo
    // Simulate user joining and admin actions via backend or stubs if needed

    // Select user in dropdown and perform admin actions
    cy.get('#userSelect').select('user2');
    cy.get('#muteBtn').click();
    cy.get('#kickBtn').click();
    cy.get('#banBtn').click();
    // Confirm UI feedback and user list updates
    cy.get('.system-message').should('contain.text', 'muted').and('contain.text', 'kicked').and('contain.text', 'banned');
  });
});
