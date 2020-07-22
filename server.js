const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const promisemysql = require('promise-mysql');

const connectionProperties = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employees_DB'
};

const connection = mysql.createConnection(connectionProperties);

connection.connect((err) => {
    if (err) throw err;
    console.log(`employee database`);
    mainMenuPrompt()

});


function mainMenuPrompt() {
    // let wantToCont = true;
    // while (wantToCont) {}
    inquirer.prompt({
        name: 'userChoice',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['Add Departments', 'Add Roles', 'Add Employees', 'View Departments', 'View Roles', 'View Employees', 'Update Departments', 'Update Roles', 'Update Employees']
    }).then((answer) => {
        switch (answer.userChoice) {
            case "Add Departments":
                addDept();
                break;

            case "Add Roles":
                addRoles();
                break;

            case "Add Employees":
                addEmp();
                break;

            case "View Departments":
                viewDept();
                break;

            case "View Roles":
                viewRoles();
                break;

            case "View Employees":
                viewEmp();
                break;

            case "Update Departments":
                updateDept();
                break;

            case "Update Roles":
                updateRoles();
                break;

            case "Update Employees":
                updateEmp();
                break;
        }
        // if the while loop is working
        //     const contEdit = inquirer.prompt({
        //         type: 'list',
        //         name: 'continue',
        //         message: 'Need to do more work?',
        //         choices: ['Yes', 'No']
        //     })

        //     if (contEdit.continue === 'No') {
        //         wantToCont = false;
        //     }
        // })
    });
};

//tested 
function addDept() {
    inquirer.prompt({
        name: 'deptName',
        type: 'input',
        message: "What's the department name?"
    }).then((answer) => {
        connection.query(`INSERT INTO department (name)VALUES ("${answer.deptName}");`, (err, res) => {
            if (err) return err;
            console.log(`Department added`);
            mainMenuPrompt();

        });
    })
};
//tested
function addRoles() {

    let deptArr = [];

    promisemysql.createConnection(connectionProperties).then((connection) => {
        return connection.query(`SELECT id, name FROM department ORDER BY name ASC`);

    }).then((departments) => {
        for (i = 0; i < departments.length; i++) {
            deptArr.push(departments[i].name);
        }

        return departments;
    }).then((departments) => {
        inquirer.prompt([
            {
                type: 'input',
                message: "What's the role title?",
                name: 'roleTitle'
            },
            {
                type: 'number',
                message: "What's the salary for this role?",
                name: 'roleSalary'
            },
            {
                type: 'list',
                message: "What's the assigned deparment id?",
                name: 'roleDepartment',
                choices: deptArr
            }
        ]).then((input) => {
            let deptID;

            for (i = 0; i < departments.length; i++) {
                if (input.roleDepartment == departments[i].name) {
                    deptID = departments[i].id;
                }
            }

            connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${input.roleTitle}", ${input.roleSalary}, ${deptID})`, (err, res) => {
                if (err) return err;
                console.log(`Role added`);
                mainMenuPrompt();
            })
        })
    })

};
//tested
function addEmp() {
    let roleArr = [];
    let managerArr = [];

    promisemysql.createConnection(connectionProperties).then((connection) => {
        return Promise.all([
            connection.query(`SELECT id, title FROM role ORDER BY title ASC`),
            connection.query(`SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC`)
        ]);
    }).then(([roles, managers]) => {
        for (i = 0; i < roles.length; i++) {
            roleArr.push(roles[i].title);
        }

        for (i = 0; i < managers.length; i++) {
            managerArr.push(managers[i].Employee);
        }

        return Promise.all([roles, managers]);
    }).then(([roles, managers]) => {
        managerArr.unshift('--');

        inquirer.prompt([
            {
                type: 'input',
                message: "What's the first name?",
                name: 'firstName'
            },
            {
                type: 'input',
                message: "last name?",
                name: 'lastName'
            },
            {
                type: 'list',
                message: "Role?",
                name: 'role',
                choices: roleArr
            },
            {
                type: 'list',
                message: "Who is their manager?",
                name: 'manager',
                choices: managerArr
            }
        ]).then((input) => {
            let roleID;
            let managerID = null;

            for (i = 0; i < roles.length; i++) {
                if (input.role == roles[i].title) {
                    roleID = roles[i].id;
                }
            }

            for (i = 0; i < managers.length; i++) {
                if (input.manager == managers[i].Employee) {
                    managerID = managers[i].id;
                }
            }

            connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUES ("${input.firstName}", "${input.lastName}", ${roleID}, ${managerID})`, (err, res) => {
                if (err) return err;
                console.log(`Employee added`);
                mainMenuPrompt();
            });

        })
    })
};
//need to be tested once we have a seed.sql file
function viewDept() {
    let deptArr =[];
    promisemysql.createConnection(connectionProperties).then((connection)=>{
        return connection.query(`SELECT name FROM department`);
    }).then((value)=>{
        deptQuery = value;
        for (i=0;i<value.length;i++){
            deptArr.push(value[i].name);
        }
    }).then(()=>{
        inquirer.prompt({
            name: 'department',
            message: "Which department would you like to search?",
            type: 'list',
            choices: deptArr
        }).then((input)=>{
            const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', 
            role.title AS Title, department.name AS Department, role.salary AS Salary, 
            concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e 
            LEFT JOIN employee m ON e.manager_id = m.id 
            INNER JOIN role ON e.role_id = role.id 
            INNER JOIN department ON role.department_id = department.id 
            WHERE department.name = '${input.department}' ORDER BY ID ASC`;
            connection.query(query, (err, res)=>{
                if(err) return err;
                console.log(`\n`);
                console.table(res);
                mainMenuPrompt();
            })
        })
    })
}

function viewRoles() { }

function viewEmp() { }

function updateDept() { }

function updateRoles() { }

function updateEmp() { }