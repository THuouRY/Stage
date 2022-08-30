Cypress.Commands.add('autocomplete', (name, value) => {
  cy.get(`input[name="${name}"]`).parent().type(value+ '{enter}');
})

Cypress.Commands.add('isAuthentified', () => {
  cy.request('https://hub-recette3.partenaire-epargne.apicil.com/interne/utilisateur/connecte')
    .should((response) => {
      expect(response.status).to.eq(200)
    })
})