//https://docs.cypress.io/guides/getting-started/testing-your-app.html#Logging-In
describe('The Home Page', function(){
  beforeEach(function(){
    // reset and seed the database prior to every test
    //cy.exec('npm run db:reset && npm run db:seed')
  })

  it('successfully loads', function() {
    cy.visit('/')
  })
})