//menus
const mainMenu = [{
    type: "list",
    message: "Select an option from the choices below: ",
    name: 'mainMenu',
    choices: ["View", "Add", "Update"]
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

module.exports = { mainMenu, viewMenu, addMenu, updateMenu }