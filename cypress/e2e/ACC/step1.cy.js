import basic from './data/basic.json';

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

const selects = [
  { key: "client.etatCivil.nationalite" },
  { key: "client.etatCivil.pays" },
  { key: "client.etatCivil.departementNaissance" },
  { key: "telephoneMobile.indicatif", prefix: "coordonnees.", suffix: "" }
]


describe('Acc - Etape 1', () => {
  before(() => {
    cy.login('nhaidant', 'test');
  })

  it('Basic test', () => {
    cy.visit('demarrer-projet-souscription#/acc')
    cy.wait(2000)
    cy.get('input[name="ocrPI"]').click();
    cy.get(`input[name="client.etatCivil.civilite.code"][value=${basic.client.etatCivil.civilite.code}]`).parent().click();
    inputs.forEach(({ key, type = "text" }) => {
      cy.get(`input[name="${key}"][type="${type}"]`).type(Cypress._.get(basic, key))
    })
    selects.forEach(({ key, prefix = "", suffix = ".libelle" }) => {
      cy.autocomplete(key, Cypress._.get(basic, prefix + key + suffix));
    })
    coordonnees.forEach(({ key, type = "text" }) => {
      cy.get(`input[name="${key}"][type="${type}"]`).type(Cypress._.get(basic, "coordonnees." + key))
    })
    // cy.get(':nth-child(3) > .MuiListItem-root > .align-right > .MuiListItemIcon-root > .MuiButtonBase-root > .MuiButton-label > .co-button__text').parent().click()
    cy.get(`input[name="client.etatCivil.villeNaissance"][type="text"]`).type(basic.client?.etatCivil?.villeNaissance.libelle);
    cy.wait(2000);
    cy.get(`input[name="client.etatCivil.villeNaissance"][type="text"]`).type('{downArrow}{enter}');

    cy.get('.adresse-autocomplete').find('input[autocomplete="autocomplete_off_hack"]').type(basic.coordonnees?.adresse?.adressePrincipale);
    cy.wait(2000);
    cy.get('.adresse-autocomplete').find('input[autocomplete="autocomplete_off_hack"]').type('{downArrow}{enter}');

    cy.get('input[name="client.etatCivil.situationFamiliale"]').parent().click()
      .get('.co-select__value').contains(basic.client?.etatCivil?.situationFamiliale?.libelle).parent().click();

    cy.intercept(
      {
        method: 'POST',
        url: 'interne/connaissanceclient/admin/brouillon/',
      },
    ).as('saveBrouillon')

    cy.get('button[text="Suivant"]').click();

    cy.wait('@saveBrouillon').then((interception) => {
      assert.isNotNull(interception.request.body, 'Les données sont envoyées vers le serveur');
      assert.equal(interception.request.body.client.etatCivil.nom, basic.client.etatCivil.nom, "Le nom saisi est bien envoyé");
      assert.equal(interception.response.body.errorCode, 400, 'Erreur de saisie de courtier');
    })

    
    
  })
})