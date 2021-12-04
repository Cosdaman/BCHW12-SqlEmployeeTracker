//setting up db
const mysql = require('mysql2');
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        // TODO: Add MySQL password
        password: '',
        database: 'employeetracker_db'
    },
    console.log(`Connected to the employeetracker_db database.`)
);

//menus
const mainMenu = [{
    type: "list",
    message: "Select an option from the choices below: ",
    name: 'mainMenu',
    choices: ["View", "Add", "Update", "Quit"]
}]

const viewMenu = [{
    type: "list",
    message: "Select an option from the choices below: ",
    name: 'viewMenu',
    choices: ["View All Departments", "View All Roles", "View All Employees"]
}]

const addMenu = [{
    type: "list",
    message: "Select an option from the choices below: ",
    name: 'addMenu',
    choices: ["Add A Department", "Add A Role", "Add An Employee"]
}]

const updateMenu = [{
    type: "list",
    message: "Select an option from the choices below: ",
    name: 'updateMenu',
    choices: ["Update An Employee",]
}]

//adding inqs

const addDept = [{
    type: "input",
    message: "What is the name of the department?",
    name: "name"
}]

const addRole = [{
    type: "input",
    message: "What is the name?",
    name: "name"
},
{
    type: "input",
    message: "What is the salary?",
    name: "salary",
    // validate(value) {
    //     value = parseInt(value)
    //     if (typeof value === 'number') {
    //         return true;
    //     }
    //     else {
    //         console.log(typeof value)
    //         return 'Please enter a number';
    //     }
    // }
},
{
    type: "input",
    message: "What is the department of the role?",
    name: "department"
}]

const addEmp = [{
    type: "input",
    message: "What is the employee's first name?",
    name: "fName"
},
{
    type: "input",
    message: "What is the employee's last name?",
    name: "lName"
},
{
    type: "input",
    message: "What is the employee's role?",
    name: "role"
},
{
    type: "input",
    message: "Who is the employee's manager?",
    name: "manager"
}]


module.exports = { mainMenu, viewMenu, addMenu, updateMenu, addDept, addRole, addEmp }