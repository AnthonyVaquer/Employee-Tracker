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