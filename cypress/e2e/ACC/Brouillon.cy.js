
describe('Acc - Etape 2', () => {
  before(() => {
    cy.login('lmarc', 'test');
  })

  it('Tester Etape1 avec Brouillon',() =>{
    cy.courtier('o')
    cy.etape1_Brouillon()
  })
})