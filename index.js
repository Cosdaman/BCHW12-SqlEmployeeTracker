//required libraries
const inquirer = require('inquirer');
const questionBank = require("./src/questionBank")

//inquirer menus and branching menus
function mainMenuInq() {
    inquirer.prompt(questionBank.mainMenu)
        .then(
            (response) => {
                switch (response.mainMenu) {
                    case 'View':
                        viewMenuInq();
                        break;

                    case 'Add':
                        addMenuInq();
                        break;

                    case 'Update':
                        updateMenuInq();
                        break;
                }
            })
        .catch(
            (error) => {
                if (error.isTtyError) {
                    console.log("error", error)
                } else {
                    console.log("something else went wrong", error)
                }
            })
}

function viewMenuInq() {
    inquirer.prompt(questionBank.viewMenu)
        .then(
            (response) => {
                switch (response.viewMenu) {
                    case 'View All Departments':
                        console.log("dep")
                        break;

                    case 'View All Roles':
                        console.log("role")
                        break;

                    case 'View All Employees':
                        console.log("emp")
                        break;
                }
            })
        .catch(
            (error) => {
                if (error.isTtyError) {
                    console.log("error", error)
                } else {
                    console.log("something else went wrong", error)
                }
            })
}

function addMenuInq() {
    inquirer.prompt(questionBank.addMenu)
        .then(
            (response) => {
                switch (response.addMenu) {
                    case 'Add A Department':
                        console.log("dep")
                        break;

                    case 'Add A Role':
                        console.log("role")
                        break;

                    case 'Add An Employee':
                        console.log("emp")
                        break;
                }
            })
        .catch(
            (error) => {
                if (error.isTtyError) {
                    console.log("error", error)
                } else {
                    console.log("something else went wrong", error)
                }
            })
}

function updateMenuInq() {
    inquirer.prompt(questionBank.updateMenu)
        .then(
            (response) => {
                switch (response.updateMenu) {
                    case 'Update An Employee':
                        console.log("emp")
                        break;
                }
            })
        .catch(
            (error) => {
                if (error.isTtyError) {
                    console.log("error", error)
                } else {
                    console.log("something else went wrong", error)
                }
            })
}

mainMenuInq();