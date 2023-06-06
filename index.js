const connect = require("./db/connection.js");
const { prompt } = require("inquirer");
const mysql = require('mysql2');


const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: '',
  database: "departments"
});

db.connect(function (err) {
  if (err) throw err;
});


const mainMenu = () => {
  prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all employees",
        "View all employees by department",
        "View all employees by manager",
        "Add department",
        "Add employee",
        "Add a role",
        "Update an employee role",
        "Exit"
      ]
    }
  ]).then(answer => {
    switch (answer.action) {
      case "View all departments":
        viewAllDepartments();
        break;
      case "View all employees":
        viewAllEmployees();
        break;
      case "View all employees by department":
        viewEmployeesByDepartment();
        break;
      case "View all employees by manager":
        viewEmployeesByManager();
        break;
      case "Add department":
        addDepartment();
        break;
      case "Add employee":
        addEmployee();
        break;
      case "Add a role":
        addRole();
        break;
      case "Update an employee role":
        updateEmployeeRole();
        break;
      case "Exit":
        console.log("Exiting program...");
        db.end();
        break;
      default:
        console.log("Invalid option selected.");
        mainMenu();
        break;
    }
  });
};

mainMenu ()


const viewAllDepartments = () => {
  const sql = `SELECT * FROM department`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }
    console.table(rows);
    mainMenu();
  });
};

const viewAllEmployees = () => {
  const sql = `SELECT * FROM employee`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }
    console.table(rows);
    mainMenu();
  });
};

const viewEmployeesByDepartment = () => {
  const sql = `
    SELECT employee.id, employee.first_name, employee.last_name, department.department_name 
    FROM employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id
    ORDER BY department.department_name, employee.last_name, employee.first_name
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }
    console.table(rows);
    mainMenu();
  });
};

const viewEmployeesByManager = () => {
  const sql = `
    SELECT employee.id, employee.first_name, employee.last_name, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
    FROM employee
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    ORDER BY manager_name, employee.last_name, employee.first_name
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }
    console.table(rows);
    mainMenu();
  });
};

const addDepartment = () => {
  prompt([
    {
      type: "input",
      name: "department_name",
      message: "Enter the name of the department:",
    },
  ]).then(answer => {
    const sql = `INSERT INTO department (department_name) VALUES (?)`;
    db.query(sql, [answer.department_name], (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`Department '${answer.department_name}' added successfully.`);
      mainMenu();
    });
  });
};