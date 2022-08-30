const situation = ['Concubin(e)','Marié(e)','Pacsé(e)'] 
const steps = ['Coordonnées','Situation professionnelle','Revenus Actuels','Patrimoine','Déclaration et validation'] 

describe('Connaissance Etap1 ', () => {
  before(() => {
    cy.login('lmarc', 'test');
  })

  it('test de fonctionalités de l etape de connaissance:', () => {
  
  cy.courtier('o')

  cy.get('input[name="ocrPI"]',{timeout:6000}).parent().click();


  // Verifier que toutes les etapes sont grises saufe celle de coordonnees---------------------------------------
  cy.get('.co-step').contains('Coordonnées').parent().should('have.class', 'co-step__active') 
  for(let i =1;i<5;i++){
    cy.get('.co-step').contains(steps[i]).parent().should('not.have.class', 'co-step__active')
  }
  //-------------------------------------------------------------------------------------------------------------

  //Departement est affiché just au cas ou le pays de naissance est la france:-----------------------------------
  cy.get('input[name="client.etatCivil.pays"]').parent().type('MAROC{enter}')
  cy.get('input[name="client.etatCivil.departementNaissance"]').should('not.exist')
  cy.get('input[name="client.etatCivil.pays"]').parent().find('input').first().clear()
  //--------------------------------------------------------------------------------------------------------------


  // Si l utilistaeur reside en france l'input d'autocomplete doit s'afficher, sinon c'est des imput simples:-----
  cy.contains('En France').should('have.class','co-inputswitch__label-on').next().click()
  cy.get('input[id="coordonnees.adresse.adressePrincipale"]').should('not.have.class','co-autocomplete__input')
  cy.contains('En France').should('have.class','co-inputswitch__label-on').next().click()
  cy.get('input[placeholder="Veuillez saisir votre adresse postale"]').should('have.class','co-autocomplete__input')
  //--------------------------------------------------------------------------------------------------------------

  //Tester la residence fiscale------------------------------------------------------------------------
  cy.get('input[name="adresseFiscaleIdentique"]').should('be.checked')
  cy.get('input[name="client.informationsFiscales.adresseFiscale.adressePrincipale"]').should('not.exist')
  cy.get('input[name="adresseFiscaleIdentique"]').click()
  cy.get('input[name="adresseFiscaleIdentique"]').should('not.be.checked')
  cy.get('input[name="client.informationsFiscales.adresseFiscale.adressePrincipale"]').should('be.visible')
  cy.get('input[name="adresseFiscaleIdentique"]').click()
  //---------------------------------------------------------------------------------------------------

  //Les coordonnees du conjoint s'affichent juste en cas de:Coucubine, Marié et Pacsé:------------------
  cy.scrollTo('bottom')

  situation.forEach((el)=>{
    cy.get('input[name="client.etatCivil.situationFamiliale"]').parent().click()
     .get('.co-select__value').contains(el).parent().click();
    cy.get('input[name="conjoint.etatCivil.nom"]').should(($in)=>{
    assert.exists($in,"input nom pour conjoint")
     })
  })
  // cy.scrollTo('bottom')
  // cy.get('input[name="client.etatCivil.situationFamiliale"]').parent().click()
  // .get('.co-select__value').contains('Concubin(e)').parent().click();
  // cy.get('input[name="conjoint.etatCivil.nom"]').should(($in1)=>{
  //   assert.exists($in1,"input nom pour conjoint")
  // })

  // cy.get('input[name="client.etatCivil.situationFamiliale"]').parent().click()
  // .get('.co-select__value').contains('Marié(e)').parent().click();
  // cy.get('input[name="conjoint.etatCivil.prenom"]').should(($in2)=>{
  //   assert.exists($in2,"input prenom pour conjoint")
  // })

  // cy.get('input[name="client.etatCivil.situationFamiliale"]').parent().click()
  // .get('.co-select__value').contains('Pacsé(e)').parent().click();
  // cy.get('input[name="conjoint.etatCivil.nationalite"]').parent().should(($in3)=>{
  //   assert.exists($in3,"input nationalite pour conjoint")
  // })

  cy.get('input[name="client.etatCivil.situationFamiliale"]').parent().click()
  .get('.co-select__value').contains('Divorcé(e)').parent().click();
  cy.get('input[name="conjoint.etatCivil.dateNaissance"]').should(($in4)=>{
    assert.notExists($in4,"input datenaissance pour conjoint")
  })
  })
})