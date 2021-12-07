//required libraries
const mysql = require('mysql2');
const inquirer = require('inquirer');
const questionBank = require("./src/questionBank")

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

                    case 'View Employee By Manager':
                        viewEmpByManager();
                        break;

                    case 'View Employees By Department':
                        viewEmpByDept();
                        break;

                    case 'Back':
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
                        addEmpInq();
                        break;

                    case 'Back':
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

function updateMenuInq() {
    inquirer.prompt(questionBank.updateMenu)
        .then(
            (response) => {
                switch (response.updateMenu) {
                    case 'Update Employee Role':
                        updateEmpRole();
                        break;

                    case 'Update Employee Manager':
                        updateEmpManager();
                        break;

                    case 'Back':
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
                let id = getID(reference, "dept_name", response, "department");
                manipulateDB(`INSERT INTO roles (title, salary, department_id) VALUES("${properTitle}", "${salary}", "${id}")`);
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
                let roleId = getID(rolesRef, "title", response, "role")
                let managerId = getID(managerRef, "fullName", response, "manager")
                manipulateDB(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES("${properfName}", "${properlName}", "${roleId}", "${managerId}")`);
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
    await db.promise().query('select id, title from roles order by id').then((results) => {
        rolesRef = results[0];
        rolesRef.forEach(element => {
            rolesArr.push(element.title)
        });
    });
    await db.promise().query('select id, CONCAT(first_name,\' \',last_name) AS fullName from employees').then((results) => {
        empRef = results[0];
        results[0].forEach(element => {
            empArr.push(element.fullName)
        });
    });
    inquirer.prompt(
        [{
            type: "list",
            message: "Select an employee: ",
            name: "employee",
            choices: empArr
        },
        {
            type: "list",
            message: "Select this employee's new role: ",
            name: "role",
            choices: rolesArr
        }]
    ).then(
        (response) => {
            let empID = getID(empRef, "fullName", response, "employee")
            let roleID = getID(rolesRef, "title", response, "role")
            manipulateDB(`UPDATE employees set role_id = ${roleID} where id = ${empID}`)
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

async function updateEmpManager() {
    let empArr = [];
    let empRef;
    await db.promise().query('select id, CONCAT(first_name,\' \',last_name) AS fullName from employees').then((results) => {
        empRef = results[0];
        results[0].forEach(element => {
            empArr.push(element.fullName)
        });
    });
    inquirer.prompt(
        [{
            type: "list",
            message: "Select an employee: ",
            name: "employee",
            choices: empArr
        },
        {
            type: "list",
            message: "Select this employee's new manager: ",
            name: "manager",
            choices: empArr
        }]
    ).then(
        (response) => {
            let empID = getID(empRef, "fullName", response, "employee")
            let manID = getID(empRef, "fullName", response, "manager")
            manipulateDB(`UPDATE employees set manager_id = ${manID} where id = ${empID}`)
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

async function viewEmpByManager() {
    let empArr = [];
    let empRef;
    await db.promise().query('select id, CONCAT(first_name,\' \',last_name) AS fullName from employees').then((results) => {
        empRef = results[0];
        results[0].forEach(element => {
            empArr.push(element.fullName)
        });
    });
    inquirer.prompt(
        [
            {
                type: "list",
                message: "Select a manager: ",
                name: "manager",
                choices: empArr
            }]
    ).then(
        (response) => {
            let manID = getID(empRef, "fullName", response, "manager")
            viewDB(`SELECT a.id, a.first_name,a.last_name, CONCAT(b.last_name," ",b.first_name) AS Manager FROM employees a  left JOIN employees b ON a.manager_id = b.id where a.manager_id= ${manID} ORDER BY a.id;`)
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

async function viewEmpByDept() {
    let deptArr = [];
    let deptRef;
    await db.promise().query('select * from department').then((results) => {
        deptRef = results[0];
        results[0].forEach(element => {
            deptArr.push(element.dept_name)
        });
    });
    inquirer.prompt(
        [{
            type: "list",
            message: "Select a department: ",
            name: "department",
            choices: deptArr
        }]
    ).then(
        (response) => {
            let deptID = getID(deptRef, "dept_name", response, "department")
            viewDB(`SELECT employees.id,first_name,last_name, roles.title,department.dept_name FROM employees  JOIN roles ON roles.id = employees.role_id JOIN department ON roles.department_id = department.id where department.id=${deptID} ORDER BY employees.id;`)
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

//capitalizes the first letter of the string
function titleCase(string) {
    let titleCased = string.toLowerCase();
    titleCased = titleCased.split('');
    titleCased[0] = titleCased[0].toUpperCase();
    titleCased = titleCased.join('')
    return titleCased;
}

//implement dry code for finding ids 
function getID(reference, refCol, response, resCol) {
    let id = (reference.find(obj => obj[refCol] == response[resCol])).id
    return id;
}

mainMenuInq();