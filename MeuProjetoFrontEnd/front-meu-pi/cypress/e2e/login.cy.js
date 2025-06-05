describe('Teste de Login', () => {
    beforeEach(() => {

        cy.visit('http://localhost:5173', {
            timeout: 10000,
            failOnStatusCode: false
        });

        cy.get('body').should('exist');
    });

    it('Deve exibir erro ao tentar logar sem preencher campos', () => {

        cy.get('form').should('exist');

        cy.get('button[type="submit"]').click();

        cy.get('#email').then(($input) => {
            expect($input[0].validationMessage).not.to.be.empty;
        });

        cy.get('#senha').then(($input) => {
            expect($input[0].validationMessage).not.to.be.empty;
        });
    });

    it('Deve mostrar mensagem de erro com credenciais inválidas', () => {

        cy.intercept('POST', '/api/Login/Login', {
            statusCode: 401,
            body: {
                message: 'Credenciais inválidas',
                error: 'Unauthorized',
                timestamp: new Date().toISOString()
            },
            delay: 500
        }).as('loginRequest');

        cy.get('#email').should('be.visible').type('email@invalido.com');
        cy.get('#senha').should('be.visible').type('senhaerrada');
        cy.get('button[type="submit"]').should('be.enabled').click();

        cy.wait('@loginRequest', { timeout: 10000 }).then((interception) => {
            expect(interception.response.statusCode).to.eq(401);
        });


        cy.get('.mensagem')
            .should('be.visible')
            .and('contain', 'Credenciais inválidas')
            .and('have.css', 'color', 'rgb(40, 167, 69)');
    });

    it('Deve logar com sucesso e redirecionar para /home-site', () => {

        cy.intercept('POST', '/api/Login/Login', {
            statusCode: 200,
            body: {
                Mensagem: 'Login realizado com sucesso.',
                Grupo: 'admin',
                Status: 'Ativo'
            },
            delay: 300
        }).as('loginRequest');

        cy.get('#email').should('be.visible').type('admin@teste.com');
        cy.get('#senha').should('be.visible').type('senhasecreta');
        cy.get('button[type="submit"]').should('be.enabled').click();

        cy.wait('@loginRequest', { timeout: 10000 }).then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });

        cy.url().should('include', '/home-site');
    });

    it('Deve carregar corretamente a página de login', () => {

        cy.get('.login-container').should('exist');
        cy.get('.login-box').should('be.visible');
        cy.get('#email').should('be.empty');
        cy.get('#senha').should('be.empty');
        cy.get('button[type="submit"]')
            .should('contain', 'Entrar')
            .and('be.enabled');
    });
});
