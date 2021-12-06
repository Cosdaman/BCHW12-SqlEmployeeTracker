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
                        console.log("Goodbye.")
                        process.kill(process.pid, 'SIGTERM')
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
                addRoleInqAdditional(response.name, response.salary);
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
                addEmpInqAdditional(response.fName, response.lName)
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

async function addRoleInqAdditional(title, salary) {
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
                let properTitle = titleCase(title)
                let id = reference.find(obj => obj.dept_name == response.department)
                manipulateDB(`INSERT INTO roles (title, salary, department_id) VALUES("${properTitle}", "${salary}", "${id.id}")`);
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

async function addEmpInqAdditional(fName, lName) {
    let rolesArr = [];
    let rolesRef;
    let managerArr = [];
    let managerRef;
    await db.promise().query('select id, title from roles order by id').then((results) => {
        rolesRef = results[0];
        rolesRef.forEach(element => {
            rolesArr.push(element.title)
        });
    });
    await db.promise().query('select id, CONCAT(first_name,\' \',last_name) AS fullName from employees').then((results) => {
        managerRef = results[0];
        results[0].forEach(element => {
            managerArr.push(element.fullName)
        });
    });
    inquirer.prompt(
        [{
            type: "list",
            message: "What is the role of this employee?",
            name: "role",
            choices: rolesArr
        },
        {
            type: "list",
            message: "Who is the manager of this employee?",
            name: "manager",
            choices: managerArr
        }
        ]
    )
        .then(
            (response) => {
                let properfName = titleCase(fName)
                let properlName = titleCase(lName)
                let roleId = rolesRef.find(obj => obj.title == response.role)
                let managerId = managerRef.find(obj => obj.fullName == response.manager)
                console.log(roleId)
                console.log(managerId)
                manipulateDB(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES("${properfName}", "${properlName}", "${roleId.id}", "${managerId.id}")`);
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

async function updateEmpRole() {
    let empArr = [];
    let empRef;
    let rolesArr = [];
    let rolesRef;
}

//capitalizes the first letter of the string
function titleCase(string) {
    let titleCased = string.toLowerCase();
    titleCased = titleCased.split('');
    titleCased[0] = titleCased[0].toUpperCase();
    titleCased = titleCased.join('')
    return titleCased;
}

//implement dry code for finding ids 

mainMenuInq();