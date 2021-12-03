//required libraries
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const questionBank = require("./src/questionBank")

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // TODO: Add MySQL password
        password: '',
        database: 'books_db'
    },
    console.log(`Connected to the books_db database.`)
);
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
                        addDeptInq();
                        break;

                    case 'Add A Role':
                        addRoleInq();
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

function addDeptInq() {
    inquirer.prompt(questionBank.addDept)
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

function addRoleInq() {
    inquirer.prompt(questionBank.addRole)
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