
describe('Acc - Etape 2', () => {
  beforeEach(() => {
    cy.login('lmarc', 'test')
  })

  
  it('Basic test', () => {
    //---------------------------------------------------------------------------------------------
    cy.courtier('o') //etape de selection du courtier

    cy.etape1() //1ere étape Coordonnées et cituation familiale

    cy.get('button[text="Suivant"][icon="next"]').click();

    cy.etape2() //2éme étape Situation Professionnelle

    cy.get('button[text="Suivant"][icon="next"]').click();

    cy.wait(1000)

    cy.etape3() //3éme étape Revenus Actules

    cy.get('button[text="Suivant"][icon="next"]').click();

    cy.wait(1000)

    cy.etape4() //4éme étape Patrimoine
    
    cy.get('button[text="Suivant"][icon="next"]').click();

    cy.wait(1000)

    //Etape Finale donner un commentaire
    cy.get('input[name="addComment"]').click()
    cy.get('textarea[name="commentaire"]').should('exist')
    cy.get('input[name="addComment"]').click()
    cy.get('textarea[name="commentaire"]').should('not.exist')
    cy.get('input[name="dateSignatureClient"]').invoke('val').should(($v) => {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();  
      today = dd + '/' + mm + '/' + yyyy;
      // $v.should('have.value',today)
      assert.equal($v,today.toString())
    })

    cy.scrollTo(0, 500) 
    cy.get('button[text="Suivant"]').click()
    cy.wait(2000)
    //-----------------------------------
  })
})