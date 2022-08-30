import basic from '../e2e/ACC/data/basic.json';
import moment from 'moment';
const situation = ['Concubin(e)','Marié(e)','Pacsé(e)'] 



const inputs = [
  { key: "client.etatCivil.prenom" },
  { key: "client.etatCivil.nom" },
  { key: "client.etatCivil.nomNaissance" },
  { key: "client.etatCivil.dateNaissance" },
  // { key: "client.etatCivil.nir" }
]

const coordonnees = [
  { key: "email", type: "email" },
  { key: "telephoneMobile.numeroTelephone", type: "tel" }
]

const selects1 = [
  { key: "client.etatCivil.nationalite" },
  { key: "client.etatCivil.pays" },
  { key: "client.etatCivil.departementNaissance" },
  { key: "telephoneMobile.indicatif", prefix: "coordonnees.", suffix: "" }
]

const selects2 = [
  {key : "client.situationProfessionnelle.situationActuelle"},
  {key : "client.situationProfessionnelle.categorieSocioProfessionnelle"},
  {key : "client.situationProfessionnelle.secteurActivite"}
]
  


Cypress.Commands.add('login', (username, password) => {
  cy.session([username,password], ()=>{
    cy.visit('/connexion')
    // cy.wait(500)
    cy.get('input[name="username"').type(username);
    // cy.wait(500)
    cy.get('#tarteaucitronPersonalize2' , { timeout: 30000}).click();
    cy.get('input[name="password"').type(password);
    cy.get("form").first().submit();
    cy.url({timeout: 60000}).should('include', 'accueil-connect')
  })

})

Cypress.Commands.add('courtier',(o)=>{
  cy.visit('demarrer-projet-souscription')

  cy.get('input[name="courtier"]', { timeout: 60000 }).type(o)
  // cy.get('input[name="courtier"]').type(o)
  cy.wait(2000)
  cy.get('input[name="courtier"]').type('{downArrow}{enter}')
  // cy.wait(700)
  cy.get('a[data-roles="RESPONSABLE_COMMERCIAL"]' , {timeout: 60000}).first().click()
  // cy.scrollTo('bottom')
  cy.get('button[text="Démarrer"]').parent().click()
  cy.wait(200)
})

Cypress.Commands.add('etape1_Brouillon',()=>{
  cy.get('input[name="ocrPI"]',{timeout:6000}).parent().click();
  //assurer que France apparait en premier :-----
  // cy.contains('Pays de naissance').parent().find('p').click()
  // cy.get('#react-select-7-option-0').should('have.text.','FRANCE')


  cy.get(`input[name="client.etatCivil.civilite.code"][value=${basic.client.etatCivil.civilite.code}]`).parent().click();

  inputs.forEach(({ key, type = "text" }) => {
    cy.get(`input[name="${key}"][type="${type}"]`).type(Cypress._.get(basic, key))
  })
  selects1.forEach(({ key, prefix = "", suffix = ".libelle" }) => {
    cy.autocomplete(key, Cypress._.get(basic, prefix + key + suffix));
  })

  coordonnees.forEach(({ key, type = "text" }) => {
  cy.get(`input[name="${key}"][type="${type}"]`).type(Cypress._.get(basic, "coordonnees." + key))
  })
  cy.get(`input[name="client.etatCivil.villeNaissance"][type="text"]`).type(basic.client?.etatCivil?.villeNaissance.libelle);
  cy.wait(1000);
  cy.get(`input[name="client.etatCivil.villeNaissance"][type="text"]`).type('{downArrow}{enter}')
  cy.get('.adresse-autocomplete').find('input[autocomplete="autocomplete_off_hack"]').type(basic.coordonnees?.adresse?.adressePrincipale,{delay: 0})
  cy.get('.adresse-autocomplete').find('input[autocomplete="autocomplete_off_hack"]').type('{downArrow}{enter}')
  cy.get(`button[text="C'est la même personne"]`,{timeout: 60000}).first().click();

  cy.get('input[name="client.etatCivil.situationFamiliale"]').parent().click()
  .get('.co-select__value').contains(basic.client?.etatCivil?.situationFamiliale?.libelle).parent().click();
  

  cy.viewport('macbook-16')
  cy.get('.co-steppers__save-draft').click()
  cy.intercept({
    method: 'POST',
    url: 'interne/connaissanceclient/admin/brouillon/'
  }).as('brouillon')
  cy.get('button[text="OK"]').click()
  cy.wait('@brouillon').then((interception) =>{

    const data = interception.request.body;
    var dt = basic.client?.etatCivil.dateNaissance ;
    var dt1 = data.client?.etatCivil.dateNaissance ;
    var dtm = moment(dt,"DD/MM/YYYY"); 
    var dtm1 = moment(dt1,"YYYY-MM-DD"); 

    expect(dtm.toDate().toString()).to.eql(dtm1.toDate().toString())
    expect(data.client?.etatCivil.nom).to.eql(basic.client?.etatCivil.nom)
    expect(data.client?.etatCivil.prenom).to.eql(basic.client?.etatCivil.prenom)
    expect(data.client?.etatCivil?.villeNaissance).to.eql(basic.client?.etatCivil?.villeNaissance)
    expect(data.client?.etatCivil?.departementNaissance).to.eql(basic.client?.etatCivil?.departementNaissance)
    expect(data.client?.etatCivil.nationalite).to.eql(basic.client?.etatCivil.nationalite)
    expect(data.client?.etatCivil?.situationFamiliale).to.eql(basic.client?.etatCivil?.situationFamiliale)
    expect(basic.client?.etatCivil?.pays).to.include(data.client?.etatCivil?.pays)
    expect(basic.client?.etatCivil?.civilite).to.include(data.client?.etatCivil?.civilite)
    // expect(data.client?.etatCivil.nomNaissance).to.eql(basic.client?.etatCivil.nomNaissance)

  })
})

Cypress.Commands.add('etape1',()=>{
  cy.get('input[name="ocrPI"]',{timeout:6000}).parent().click();
  
  
  //assurer que France apparait en premier :-----
  // cy.contains('Pays de naissance').parent().find('p').click()
  // cy.get('#react-select-7-option-0').should('have.text.','FRANCE')


  cy.get(`input[name="client.etatCivil.civilite.code"][value=${basic.client.etatCivil.civilite.code}]`).parent().click();

  inputs.forEach(({ key, type = "text" }) => {
    cy.get(`input[name="${key}"][type="${type}"]`).type(Cypress._.get(basic, key))
  })
  selects1.forEach(({ key, prefix = "", suffix = ".libelle" }) => {
    cy.autocomplete(key, Cypress._.get(basic, prefix + key + suffix));
  })
  coordonnees.forEach(({ key, type = "text" }) => {
  cy.get(`input[name="${key}"][type="${type}"]`).type(Cypress._.get(basic, "coordonnees." + key))
  })
  cy.get(`input[name="client.etatCivil.villeNaissance"][type="text"]`).type(basic.client?.etatCivil?.villeNaissance.libelle);
  cy.wait(1000);
  cy.get(`input[name="client.etatCivil.villeNaissance"][type="text"]`).type('{downArrow}{enter}')
  cy.get('.adresse-autocomplete').find('input[autocomplete="autocomplete_off_hack"]').type(basic.coordonnees?.adresse?.adressePrincipale,{delay: 0})
  cy.get('.adresse-autocomplete').find('input[autocomplete="autocomplete_off_hack"]').type('{downArrow}{enter}',{delay: 0})
  cy.get(`button[text="C'est la même personne"]`,{timeout: 60000}).first().click()

  cy.get('input[name="client.etatCivil.situationFamiliale"]').parent().click()
  .get('.co-select__value').contains(basic.client?.etatCivil?.situationFamiliale?.libelle).parent().click();
  

  // cy.get('div[class="co-steppers__save-draft"][role="button"]').click()
  //J'ai pas bien compris cette partie -----------------------------------
  // cy.intercept(
  //   {
  //     method: 'POST',
  //     url: 'interne/connaissanceclient/admin/brouillon/',
  //   },
  // ).as('saveBrouillon')
  //  cy.wait('@saveBrouillon').then((interception) => {
  //   assert.isNotNull(interception.request.body, 'Les données sont envoyées vers le serveur');
  //   })
  //--------------------------------------------------------------------

})

Cypress.Commands.add('ChampsObl',()=>{
  cy.get(`input[name="client.etatCivil.villeNaissance"][type="text"]`).clear()
  cy.get('button[text="Suivant"][icon="next"]').click()
  cy.get('input[name="client.situationProfessionnelle.travailleurNonSalarie"]').should('not.exist')
  
})

Cypress.Commands.add('etape2',()=>{
 
  cy.get(`button[text="C'est la même personne"]`,{timeout: 60000}).first().click()
  selects2.forEach(({key , suff=".libelle"})=>{
    cy.autocomplete(key,Cypress._.get(basic,key + suff))
  })

 
  cy.get('input[name="client.situationProfessionnelle.travailleurNonSalarie"]').parent().click();
  cy.get('input[name="client.situationProfessionnelle.professionActuelle"]').type(basic.client?.situationProfessionnelle.professionActuelle);
 
  //S'il est un PPE un champ pour preciser la fonction doit s'afficher: ----------------------- 
 cy.get('input[name="isPersonExposeForClient"]').click()
  cy.get('input[name="client.situationProfessionnelle.informationsPPE.fonction"]').parent().should(($p)=>{
  assert.exists($p,"s'assurer que le champ PPe exists")
  })
  cy.get('input[name="isPersonExposeForClient"]').click()
  cy.get('input[name="isLienAvecPPEForClient"]').click()

  cy.get('input[name="client.situationProfessionnelle.lienPPE.natureLien"]').parent().should(($p)=>{
    assert.exists($p,"s'assurer que le champ PPe exists")
  })
  cy.get('input[name="client.situationProfessionnelle.lienPPE.nom"]').should(($p)=>{
    assert.exists($p,"s'assurer que le champ PPe exists")
  })
  cy.get('input[name="client.situationProfessionnelle.lienPPE.prenom"]').should(($p)=>{
    assert.exists($p,"s'assurer que le champ PPe exists")
  })
  cy.get('input[name="client.situationProfessionnelle.lienPPE.fonction"]').parent().should(($p)=>{
    assert.exists($p,"s'assurer que le champ PPe exists")
  })
  cy.get('input[name="isLienAvecPPEForClient"]').click()
 //---------------------------------------------------------------------------------------------

 //La situation pro du conjoint change selon la situation familialle:---------------------------

 situation.forEach((el)=>{
  cy.get('input[name="client.etatCivil.situationFamiliale"]').parent().scrollIntoView().click()
  .get('.co-select__value').contains('Concubin(e)').parent().click()
  cy.get('input[name="conjoint.situationProfessionnelle.situationActuelle"]').parent().scrollIntoView().should(($l)=>{
    assert.exists($l,"s'assurer que les input pour conjoint existent")
  })
 })


 cy.get('input[name="client.etatCivil.situationFamiliale"]').parent().scrollIntoView().click()
 .get('.co-select__value').contains('Séparé(e) de corps').parent().click()
 cy.get('input[name="conjoint.situationProfessionnelle.situationActuelle"]').should('not.exist')
 
  
  //------------------------------------------------------------------------------------------
})

Cypress.Commands.add('etape3', ()=>{
  let sumClient = 0 , sumFoyer=0;
  cy.get('.p-datatable-tbody').within(()=>{
    for(let i = 0;i<6;i++){
      var temp = basic.client?.revenus[i].montant;
      cy.contains(basic.client?.revenus[i].typeRevenu.libelle).parentsUntil('tbody').last().find('input[name="client"]').as('l1')
        cy.get('@l1').type(temp)
        // cy.get('@l1').should('have.value',parseInt(temp))
        sumClient+=parseInt(temp) ;
    } 
  })

  cy.contains('Total annuel des revenus disponibles').parent().parent().within(()=>{
    cy.contains('Vous').next().invoke('text').then(text => {
      const t = text.replace(/[' €]+/g,'');

      assert.equal(parseInt(t),sumClient,'agales')
    })

  })
  cy.get('.p-datatable-tbody').last().as('tab')
  cy.get('button[text="Ajouter une ligne"]').click()
  cy.get('@tab').find('tr').should('have.length',6 + 1)
  cy.get('@tab').find('tr').last().within(()=>{
    cy.contains('Nature').parent().click()
    cy.get('#react-select-9-option-0 > .MuiTypography-root').click()
    cy.get('input[name="preciserRevenu"]').should('exist')
    cy.get('td').last().click()
  })
  
})

Cypress.Commands.add('etape4',()=>{
  var sumClient = 0;
  cy.get('.p-datatable-tbody').should(($table)=>{
    expect($table).to.have.length(2)
  })
  cy.get('.p-datatable-tbody').last().within(()=>{
    for(let i =0;i<8;i++){
      var temp = basic.client?.patrimoine[i].montant ;
      cy.contains(basic.client?.patrimoine[i].typePatrimoine.libelle).parentsUntil('tbody').last().find('input[name="client"]').as('ll1')
      cy.get('@ll1').type(temp);
      sumClient+=parseInt(temp) ;
    }
  })
  cy.contains('Patrimoine total net').parent().parent().within(()=>{
    cy.contains('Vous').next().invoke('text').then(text => {
      const t = text.replace(/[' €]+/g,'');

      assert.equal(parseInt(t),sumClient,'Egales')
    })

  })

  cy.get('.p-datatable-tbody').last().as('tab2')
  cy.get('button[text="Ajouter une ligne"]').last().click()
  cy.get('@tab2').find('tr').should('have.length',8 + 1)
  cy.get('@tab2').find('td').last().click()
  
})

Cypress.Commands.add('isAuthentified', () => {
    cy.request('https://hub-recette3.partenaire-epargne.apicil.com/interne/utilisateur/connecte')
    .should((response) => {
      expect(response.status).to.eq(200)
    })
})


