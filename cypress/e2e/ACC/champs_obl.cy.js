describe('Acc - Etape 2', () => {
    before(() => {
      cy.login('lmarc', 'test');
    })
  
    it('tester champs obligatoires',() =>{
      cy.courtier('o')
      cy.etape1()
      cy.ChampsObl()
    })
  })