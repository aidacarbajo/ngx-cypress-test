describe('Our first suite', () => {

    beforeEach(() => {
        cy.visit('localhost:4200');
        cy.contains('Forms').click();
        cy.contains('Form Layouts').click();
        cy.get('.sidebar-toggle').click();
    })
   
    
    it('first test', () => {

        // by Tag Name
        cy.get('input');

        // by id
        cy.get('#inputEmail1');

        // by class
        cy.get('.input-full-width');

        // by attribute
        cy.get('[placeholder]');

        // by attribute name and value
        cy.get('[placeholder="Email"]');

        // by class value
        cy.get('[class="input-full-width size-medium shape-rectangle"]');

        // by tag name and attribute value
        cy.get('input[placeholder="Email"]');

        // by two different attributes
        cy.get('[placeholder="Email"][type="email"][fullwidth]');

        // by tag name, attribute with value, id and class
        cy.get('input[placeholder="Email"]#inputEmail1.input-full-width');

        // the most recomended way by cypress --> with custom data
        cy.get('[data-cy="imputEmail1"]');

        // OJO. te devuelve solo el primer elemento encontrado
        cy.contains('Sign in');

        cy.contains('[status="warning"]', 'Sign in');

    })
    

    it('second test', () => {
        cy.get('[data-cy="signInButton"]');

        cy.get('#inputEmail3')
            .parents('form')
            .find('button')
            .should('contain', 'Sign in')
            .parents('form')
            .find('nb-checkbox')
            .click();

        cy.contains('nb-card', 'Horizontal form').find('input[type="email"]');
    });


    it('then and wrap methods', () => {
        cy.contains('nb-card', 'Using the Grid').then( firstForm => {
            const emailLabel = firstForm.find('[for="inputEmail1"]').text();
            const pswLabel = firstForm.find('[for="inputPassword2"]').text();
            expect(emailLabel).to.equal("Email");
            expect(pswLabel).to.equal("Password");

            cy.contains('nb-card', 'Basic form')
                .then( secondForm => {
                    const pswLabel2 = secondForm.find('[for="exampleInputPassword1"]').text();
                    expect(pswLabel2).to.equal(pswLabel);
                    // ===
                    cy.wrap(secondForm).find('[for="exampleInputPassword1"]').should('contain', 'Password');
                });
        });
    })


    it('invoke command', () => {
        // 1
        cy.get('[for="exampleInputEmail1"]').should('contain', 'Email address');
        // 2
        cy.get('[for="exampleInputEmail1"]').then( label => {
            expect(label.text()).to.equal('Email address')
        })
        // 3
        cy.get('[for="exampleInputEmail1"]').invoke('text').then(text => {
            expect(text).to.equal("Email address");
        });
        // 4 
        cy.contains('nb-card', 'Basic form')
            .find('nb-checkbox')
            .click()
            .find('.custom-checkbox')
            .invoke('attr', 'class')
            //.should('contain', 'checked')     --> way 1
            .then(classValue => {           // --> way 2
                expect(classValue).to.contain('checked')
            })
    });


    it.only('assert property', () => {
        cy.get('.sidebar-toggle').click();
        cy.contains('Datepicker').click();
        cy.get('.sidebar-toggle').click();

        let date = new Date();
        date.setDate(date.getDate() + 5);

        let futureDay = date.getDay();
        let futureMonth = date.toLocaleDateString('default', {month: 'short'});

        cy.contains('nb-card', 'Common Datepicker').find('input').then(input => {
            cy.wrap(input).click();
            cy.get('nb-calendar-picker')
                .contains('17')
                .click();
            cy.wrap(input)
                .invoke('prop', 'value')
                .should('contain', 'Aug 17, 2022');
        })

    });


    it('radio button', () => {
        cy.get('nb-radio-group').find('[type="radio"]').then(radioButtons => {
            cy.wrap(radioButtons)
                .first()
                .check({force: true})
                .should('be.checked')

            cy.wrap(radioButtons)
                .eq(1)
                .check({force: true})

            cy.wrap(radioButtons)
                .eq(2)
                .should('be.disabled')

        })
    });


    it('check box', () => {
        cy.get('.sidebar-toggle').click();
        cy.contains('Modal & Overlays').click();
        cy.contains('Toastr').click();
        cy.get('.sidebar-toggle').click();

        cy.get('[type="checkbox"]')
            .check({force: true})   // every checkbox will be checked
            //.uncheck({force: true})
            .first()
            .uncheck({force: true})
    });


    it('lists and drop lists', () => {
        // 1
        // cy.get('nb-select').click();
        // cy.get('.options-list').contains('Dark').click();

        // cy.get('nb-select')
        //     .find('button')
        //     .should('contain', 'Dark');

        // cy.get('nb-layout-header nav')
        //     .should('have.css', 'background-color', 'rgb(34, 43, 69)');
    
    
        // 2
        cy.get('nav nb-select').then( dropdown => {
            cy.wrap(dropdown).click();
            cy.get('.options-list nb-option').each(( listItem, index )=> {
                const itemText = listItem.text().trim();

                const colors = {
                    "Light": "rgb(255, 255, 255)",
                    "Dark": "rgb(34, 43, 69)",
                    "Cosmic": "rgb(50, 50, 89)",
                    "Corporate": "rgb(255, 255, 255)"
                }

                cy.wrap(listItem).click();
                cy.wrap(dropdown).should('contain', itemText);
                cy.get('nb-layout-header nav')
                    .should('have.css', 'background-color', colors[itemText]);
                
                if(index < 3) {
                    cy.wrap(dropdown).click();
                }

            })
        })
    });
    

    it('Web tables', () => {
        cy.get('.sidebar-toggle').click();
        cy.contains('Tables & Data').click();
        cy.contains('Smart Table').click();
        cy.get('.sidebar-toggle').click();

        // 1: cosas varias
        cy.get('tbody').contains('tr', 'Larry').then( tableRow => {
            cy.wrap(tableRow).find('.nb-edit').click({force: true});
            cy.wrap(tableRow).find('[placeholder="Age"]').clear().type('25');
            cy.wrap(tableRow).find('.nb-checkmark').click({force: true});
            cy.wrap(tableRow).find('td').eq(6).should('contain', '25');
        })

        // 2: create
        cy.get('thead').find('.nb-plus').click();
        cy.get('.ng-star-inserted').then( insertRow => {
            cy.wrap(insertRow).find('[ng-reflect-name="id"]').type('1');
            cy.wrap(insertRow).find('[ng-reflect-name="firstName"]').type('Aida');
            cy.wrap(insertRow).find('[ng-reflect-name="lastName"]').type('Carbajo');
            cy.wrap(insertRow).find('[ng-reflect-name="username"]').type('aiduu_carbajo');
            cy.wrap(insertRow).find('[ng-reflect-name="email"]').type('carbaaid@adidas.com');
            cy.wrap(insertRow).find('[ng-reflect-name="age"]').type('23');
            cy.wrap(insertRow).find('.nb-checkmark').click();
        })

        cy.get('tbody tr').first().find('td').then(tableColumns => {
            cy.wrap(tableColumns).eq(2).should('contain', 'Aida');
        })

        // 3: read
        let age = [20, 40];

        cy.wrap(age).each( age => {
            cy.get('thead [placeholder="Age"]').clear().type(age);
            cy.wait(500);
            cy.get('tbody tr').each(tableRows => {
                cy.wrap(tableRows).find('td').eq(6).should('contain',  age);
            })    
        })

    })

})