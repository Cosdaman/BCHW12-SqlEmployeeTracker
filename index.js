const inquirer = require('inquirer');
const questionBank = require("./src/questionBank")

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
                console.log(response)
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
                console.log(response)
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
                console.log(response)
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