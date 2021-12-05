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
},
// {
//     type: "list",
//     message: "Which department does this role belong to?",
//     name: "department",
//     choices: ["Update An Employee"]
// }
]

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

// async function prepDept() {
//     await db.promise().query('SELECT * from department').then((results) => {
//         console.log(results[0])
//     });
//     mainMenuInq();
// }

// prepDept();

module.exports = { mainMenu, viewMenu, addMenu, updateMenu, addDept, addRole, addEmp }