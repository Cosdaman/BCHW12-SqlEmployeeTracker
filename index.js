//required libraries
const mysql = require('mysql2');
const inquirer = require('inquirer');
const questionBank = require("./src/questionBank")

//express 
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        //Add MySQL password
        password: '',
        database: 'employeetracker_db'
    },
    console.log(`Connected to the employeetracker_db database.`)
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

                    case 'Quit':
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
                        //add promise
                        db.query('SELECT * FROM department ORDER BY id;', function (err, results) {
                            console.log('\n')
                            console.table(results);
                            console.log('\n')
                        });
                        mainMenuInq();
                        break;

                    case 'View All Roles':
                        db.query('SELECT roles.title,roles.id,department.dept_name,roles.salary FROM roles LEFT JOIN department ON department.id = roles.department_id ORDER BY roles.id ;', function (err, results) {
                            console.table(results);
                        });
                        mainMenuInq();
                        break;

                    case 'View All Employees':
                        db.query('SELECT a.id, a.first_name,a.last_name, roles.title,department.dept_name,roles.salary, CONCAT(b.last_name,', ',b.first_name) AS Manager FROM employees a JOIN roles ON roles.id = a.role_id JOIN department ON roles.department_id = department.id left JOIN employees b ON a.manager_id = b.id ORDER BY a.id;', function (err, results) {
                            console.table(results);
                        });
                        mainMenuInq();
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