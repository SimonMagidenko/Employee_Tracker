const express = require('express');
const inquirer = require('inquirer');
const mySQL = require('mysql2/promise');
const db = require('./database/connection');
const consoleTable = require('console.table');
const { resolve } = require('path');
const { rejects } = require('assert');

const PORT = process.env.PORT || 3001;
const app = express();

// Express Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Response for any unspecified response
app.use((req, res) => {
    res.status(404).end();
});

// Start server after Database connects
db.connect(err => {
    if (err) throw err;
    app.listen(PORT, () => { });
});

const startPrompt = async () => {
    const mainMenuOptions = await inquirer.prompt({
        type: 'list',
        name: 'Main Menu',
        message: 'Please choose an option provided below.',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'View Employees by Manager', 'View Employees by Department', 'View Department Budget', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Update an Employee Manager', 'Delete Department', 'Delete Role', 'Delete Employee'],
    });
    const selectedOption = mainMenuOptions['Main Menu'];

    switch (selectedOption) {
        case 'View All Departments':
            await viewAllDepartments();
            break;
        case 'View All Roles':
            await viewAllRoles();
            break;
        case 'View All Employees':
            await viewAllEmployees();
            break;
        case 'View Employees by Manager':
            await viewEmployeesByManager();
            break;
        case 'View Employees by Department':
            await viewEmployeesByDepartment();
            break;
        case 'View Department Budget':
            await viewDepartmentBudget();
            break;
        case 'Add a Department':
            await addDepartment();
            break;
        case 'Add a Role':
            await addRole();
            break;
        case 'Add an Employee':
            await addEmployee();
            break;
        case 'Update an Employee Role':
            await updateEmployeeRole();
            break;
        case 'Update an Employee Manager':
            await updateEmployeeManager();
            break;
        case 'Delete Department':
            await deleteDepartment();
            break;
        case 'Delete Role':
            await deleteRole();
            break;
        case 'Delete Employee':
            await deleteEmployee();
            break;
        default:
            console.log('Invalid option');
            break;
    }
};

const viewAllDepartments = async () => {
    const queryRequest = 'Select * FROM department';
    db.query(queryRequest, (err, res) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return;
        }
        console.table(res);
        startPrompt();
    });
};

const viewAllRoles = async () => {
    const queryRequest = 'Select * from role';
    db.query(queryRequest, (err, res) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return;
        }
        console.table(res);
        startPrompt();
    });
};

const viewAllEmployees = async () => {
    const queryRequest = `SELECT employee.id,
                employee.first_name,
                employee.last_name,
                role.title AS job_title,
                department.department_name,
                role.salary,
                CONCAT(manager.first_name, ' ' ,manager.last_name) AS Manager
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee AS manager ON employee.manager_id = manager.id
                ORDER By employee.id`;
    db.query(queryRequest, (err, res) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return;
        }
        console.table(res);
        startPrompt();
    });
};

const viewEmployeesByManager = async () => {
    try {
        const viewEmployeesByManagerPrompt = await inquirer.prompt([
            {
                name: "manager_id",
                type: "number",
                message: "Please enter the manager's id number to view employees under their management (ONLY NUMBERS ALLOWED)."
            }
        ]);

        const managerId = parseInt(viewEmployeesByManagerPrompt.manager_id);
        if (isNaN(managerId)) {
            console.log("Invalid input. Please enter a valid id.");
            startPrompt();
            return;
        }

        const queryRequest = `
        SELECT employee.id, employee.first_name, employee.last_name, role.title AS role_title
        FROM employee
        JOIN role ON employee.role_id = role.id
        WHERE employee.manager_id = ?
      `;
        const params = [viewEmployeesByManagerPrompt.manager_id];

        const queryResult = await new Promise((resolve, reject) => {
            db.query(queryRequest, params, (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });

        console.table(queryResult);
        startPrompt();
    } catch (error) {
        console.error(error.message);
    }
};


const viewEmployeesByDepartment = async () => {
    try {
        const viewEmployeesByDepartmentPrompt = await inquirer.prompt([
            {
                name: "department_id",
                type: "number",
                message: "Please enter the department's id number to view employees in that department (ONLY NUMBERS ALLOWED). "
            }
        ]);

        const departmentId = parseInt(viewEmployeesByDepartmentPrompt.department_id);
        if (isNaN(departmentId)) {
            console.log("Invalid input. Please enter a valid id.");
            startPrompt();
            return;
        }

        const queryRequest = `
        SELECT employee.id, employee.first_name, employee.last_name, role.title AS role_title
        FROM employee
        JOIN role ON employee.role_id = role.id
        WHERE role.department_id = ?
      `;
        const params = [viewEmployeesByDepartmentPrompt.department_id];

        const queryResult = await new Promise((resolve, reject) => {
            db.query(queryRequest, params, (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });

        console.table(queryResult);
        startPrompt();
    } catch (error) {
        console.error(error.message)
    }
};

const viewDepartmentBudget = async () => {
    try {
        const viewDepartmentBudgetPrompt = await inquirer.prompt([
            {
                name: "department_id",
                type: "number",
                message: "Please enter the id of the department you want to view the budget for. Enter ONLY numbers."
            }
        ]);

        const departmentId = parseInt(viewDepartmentBudgetPrompt.department_id);
        if (isNaN(departmentId)) {
            console.log("Invalid input. Please enter a valid id.");
            startPrompt();
            return;
        }

        const queryRequest = `
        SELECT department.department_name, SUM(role.salary) AS utilized_budget
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        WHERE department.id = ?
        GROUP BY department.id
      `;
        const params = [viewDepartmentBudgetPrompt.department_id];

        const queryResult = await new Promise((resolve, reject) => {
            db.query(queryRequest, params, (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });

        console.table(queryResult);
        startPrompt();
    } catch (error) {
        console.error(error.message);
    }
};

const addDepartment = async () => {
    try {
        const addDepartmentPrompt = await inquirer.prompt([
            {
                name: "add_department",
                type: "input",
                message: "Please enter the name of the department you would like to add to the database.",
            },
        ]);

        const departmentName = addDepartmentPrompt.add_department;

        if (!departmentName.trim()) {
            console.log('Department name cannot be empty. The department was not added.');
            startPrompt();
            return;
        }

        const queryRequest = `INSERT INTO department (department_name) VALUES (?)`;
        const params = [departmentName];

        await new Promise((resolve, reject) => {
            db.query(queryRequest, params, (err, res) => {
                if (err) reject(err);
                console.log('The new department you have entered has been added successfully to the database.');
                resolve(res);
            });
        });

        const queryResult = await new Promise((resolve, reject) => {
            db.query(`SELECT * FROM department`, (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });

        console.table(queryResult);
        startPrompt();
    } catch (error) {
        console.error(error.message);
    }
};



const addRole = async () => {
    try {
        const addRolePrompt = await inquirer.prompt([
            {
                name: "role_title",
                type: "input",
                message: "Please enter the title of the role you would like to add."
            },
            {
                name: "role_salary",
                type: "number",
                message: "Please enter the salary associated with the role inputted in the previous prompt. (Do not use commas or dots."
            },
            {
                name: "department_id",
                type: "number",
                message: "Please enter the department's id associated with the role you want to add to the database."
            }
        ]);
        const queryRequest = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
        const params = [addRolePrompt.role_title, addRolePrompt.role_salary, addRolePrompt.department_id];

        await new Promise((resolve, reject) => {
            db.query(queryRequest, params, (err, res) => {
                if (err) reject(err);
                console.log('The new role you have entered has been added successfully to the database.');
                resolve(res);
            });
        });

        const queryResult = await new Promise((resolve, reject) => {
            db.query(`SELECT * FROM role`, (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });

        console.table(queryResult);
        startPrompt()
    } catch (error) {
        console.error(error.message);
    };
};

const addEmployee = async () => {
    try {
        const addEmployeePrompt = await inquirer.prompt([
            {
                name: "first_name",
                type: "input",
                message: "Please enter the first name of the employee you would like to add to the database."
            },
            {
                name: "last_name",
                type: "input",
                message: "Please enter the last name of the employee you would like to add to the database."
            },
            {
                name: "role_id",
                type: "number",
                message: "Please enter the role id associated with the employee you want to add to the database (ONLY NUMBERS ALLOWED)."
            },
            {
                name: "manager_id",
                type: "number",
                message: "Please enter the manager's id associated with the employee you would like to add to the database (ONLY NUMBERS ALLOWED)."
            }
        ]);
        const queryRequest = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
        const params = [addEmployeePrompt.first_name, addEmployeePrompt.last_name, addEmployeePrompt.role_id, addEmployeePrompt.manager_id];
        await new Promise((resolve, reject) => {
            db.query(queryRequest, params, (err, res) => {
                if (err) reject(err);
                console.log(`The new employee you have entered has been added successfully to the database`);
                resolve(res);
            });
        });


        const queryResult = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM employee', (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });

        console.table(queryResult);
        startPrompt();
    } catch (error) {
        console.error(error.message);
    };
};

const updateEmployeeRole = async () => {
    try {
        const updateEmployeeRolePrompt = await inquirer.prompt([
            {
                name: "first_name",
                type: "input",
                message: "Please enter the first name of the employee you want to update in the database."
            },
            {
                name: "last_name",
                type: "input",
                message: "Please enter the last name of the employee you want to update in the database."
            },
            {
                name: "role_id",
                type: "number",
                message: "Please enter the new role number id associated with the employee you want to update in the database (ONLY NUMBERS ALLOWED)."
            }
        ]);

        const queryRequest = "UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?";
        const params = [updateEmployeeRolePrompt.role_id, updateEmployeeRolePrompt.first_name, updateEmployeeRolePrompt.last_name];

        await new Promise((resolve, reject) => {
            db.query(queryRequest, params, (err, res) => {
                if (err) reject(err);
                console.log(`The employee's role that you selected has been updated successfully in the database.`);
                resolve(res);
            });
        });

        const queryResult = await new Promise((resolve, reject) => {
            db.query(`SELECT * FROM employee`, (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });

        console.table(queryResult);
        startPrompt();
    } catch (error) {
        res.status(500).json({ error: error.message });
    };
};

const updateEmployeeManager = async () => {
    try {
        const updateEmployeeManagerPrompt = await inquirer.prompt([
            {
                name: "first_name",
                type: "input",
                message: "Please enter the first name of the employee you want to update in the database."
            },
            {
                name: "last_name",
                type: "input",
                message: "Please enter the last name of the employee you want to update in the database."
            },
            {
                name: "manager_id",
                type: "input",
                message: "Please enter the new manager's id number associated with the employee you want to update in the database (ONLY NUMBERS ALLOWED), or leave it empty to remove the manager."
            }
        ]);

        let managerIdValue = updateEmployeeManagerPrompt.manager_id;
        if (managerIdValue.trim() === "") {
            managerIdValue = null;
        }

        const queryRequest = "UPDATE employee SET manager_id = ? WHERE first_name = ? AND last_name = ?";
        const params = [managerIdValue, updateEmployeeManagerPrompt.first_name, updateEmployeeManagerPrompt.last_name];

        await new Promise((resolve, reject) => {
            db.query(queryRequest, params, (err, res) => {
                if (err) reject(err);
                console.log(`The employee's manager that you have selected has been updated successfully in the database.`);
                resolve(res);
            });
        });

        const queryResult = await new Promise((resolve, reject) => {
            db.query(`SELECT * FROM employee`, (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });

        console.table(queryResult);
        startPrompt();
    } catch (error) {
        console.error(error.message);
    }
};


const deleteDepartment = async () => {
    try {
        const deleteDepartmentPrompt = await inquirer.prompt([
            {
                name: "department_id",
                type: "number",
                message: "Please enter the id of the department you want to delete from the database (ONLY NUMBERS ALLOWED)."
            }
        ]);

        const queryRequest = "DELETE FROM department WHERE id = ?";
        const params = [deleteDepartmentPrompt.department_id];

        await new Promise((resolve, reject) => {
            db.query(queryRequest, params, (err, res) => {
                if (err) reject(err);
                console.log("The department entered has been deleted successfully from the database.");
                resolve(res);
            });
        });

        const queryResult = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM department", (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });

        console.table(queryResult);
        startPrompt();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteRole = async () => {
    try {
        const deleteRolePrompt = await inquirer.prompt([
            {
                name: "role_id",
                type: "number",
                message: "Please enter the id of the role you want to delete from the database (ONLY NUMBERS ALLOWED)."
            }
        ]);

        const queryRequest = "DELETE FROM role WHERE id = ?";
        const params = [deleteRolePrompt.role_id];

        await new Promise((resolve, reject) => {
            db.query(queryRequest, params, (err, res) => {
                if (err) reject(err);
                console.log("The role entered has been deleted successfully from the database.");
                resolve(res);
            });
        });

        const queryResult = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM role", (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });

        console.table(queryResult);
        startPrompt();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteEmployee = async () => {
    try {
        const deleteEmployeePrompt = await inquirer.prompt([
            {
                name: "employee_id",
                type: "number",
                message: "Please enter the id of the employee you want to delete from the database (ONLY NUMBERS ALLOWED). "
            }
        ]);

        const queryRequest = "DELETE FROM employee WHERE id = ?";
        const params = [deleteEmployeePrompt.employee_id];

        await new Promise((resolve, reject) => {
            db.query(queryRequest, params, (err, res) => {
                if (err) reject(err);
                console.log("The employee entered has been deleted successfully from the database.");
                resolve(res);
            });
        });

        const queryResult = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM employee", (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });

        console.table(queryResult);
        startPrompt();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

startPrompt();
