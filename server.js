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
}

// const addRoles = () => {
//     let deptArr = [];
//     promisemysql.createConnection(connectionProperties).then((connection) => {
//         return connection.query(`SELECT id, name FROM department ORDER BY name ASC`);
//     }).then((departments) => {
//         for (i = 0; i < deparments.length; i++) {
//             deptArr.push(departments[i].name);
//         }

//         return departments;
//     }).then((departments) => {
//         inquirer.prompt([
//             {
//                 type: 'input',
//                 message: "What's the role title?",
//                 name: 'roleTitle'
//             },
//             {
//                 type: 'number',
//                 message: "What's the salary for this role?",
//                 name: 'roleSalary'
//             },
//             {
//                 type: 'list',
//                 message: "What's the assigned deparment id?",
//                 name: 'roleDepartment',
//                 choices: deptArr
//             }
//         ]). then((input)=>{
//             let deptID;
//             for(i=0; i<departments.length; i++){
//                 if(input.roleDepartment == departments[i].name){
//                     deptID = departments[i].id;
//                 }
//             }

//             connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${input.roleTitle}", ${input.roleSalary}, ${input.deptID})`, (err, res) =>{
//                 if (err) return err;
//                 console.log(`Role added`);
//             })
//         })
//         mainMenuPrompt();
//     })

// }

