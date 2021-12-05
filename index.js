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
                        viewDB('SELECT * FROM department ORDER BY id;');
                        break;

                    case 'View All Roles':
                        viewDB('SELECT roles.title,roles.id,department.dept_name,roles.salary FROM roles LEFT JOIN department ON department.id = roles.department_id ORDER BY roles.id ;');
                        break;

                    case 'View All Employees':
                        viewDB(`SELECT a.id, a.first_name,a.last_name, roles.title,department.dept_name,roles.salary, CONCAT(b.last_name,\',\',b.first_name) AS Manager FROM employees a JOIN roles ON roles.id = a.role_id JOIN department ON roles.department_id = department.id left JOIN employees b ON a.manager_id = b.id ORDER BY a.id;`)
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
                        addEmpInq();
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
                //convert to title case
                let departmentName = titleCase(response.name);
                manipulateDB(`INSERT INTO department (dept_name) VALUES ("${departmentName}")`);
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
                departmentInq(response.name, response.salary);
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

function addEmpInq() {
    inquirer.prompt(questionBank.addEmp)
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

async function viewDB(dbQuery) {
    await db.promise().query(dbQuery).then((results) => {
        console.table(results[0])
    });
    mainMenuInq();
}

async function manipulateDB(dbQuery) {
    await db.promise().query(dbQuery).then(() => {
        console.log("Query successful.")
    });
    mainMenuInq();
}

async function departmentInq(title, salary) {
    let deptArr = [];
    let reference;
    //todo title case the title in insert
    await db.promise().query('select * from department').then((results) => {
        reference = results[0];
        results[0].forEach(element => {
            deptArr.push(element.dept_name)
        });
    });
    inquirer.prompt(
        [{
            type: "list",
            message: "Which department does this role belong to?",
            name: "department",
            choices: deptArr
        }]
    )
        .then(
            (response) => {
                let id = reference.find(obj => obj.dept_name = response.department)
                manipulateDB(`INSERT INTO roles (title, salary, department_id) VALUES("${title}", "${salary}", "${id.id}")`);
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

function titleCase(string) {
    let titleCased = string.toLowerCase();
    titleCased = titleCased.split('');
    titleCased[0] = titleCased[0].toUpperCase();
    titleCased = titleCased.join('')
    return titleCased;
}


mainMenuInq();