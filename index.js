const connect = require("./db/connection.js");
const { prompt } = require("inquirer");
const mysql = require('mysql2');

// create db connection
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: '',
  database: "departments"
});

db.connect(function (err) {
  if (err) throw err;
});


// run list of user choices in terminal
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
        console.log("Exiting the program");
        db.end();
        break;
    }
  });
};

mainMenu ()

// display table of all departments
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


// display table of all employees w/ role_id and manager_id
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

// display table of all employees and their department
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


// displays all employees and their corresponding manager_id
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


// create new department
const addDepartment = () => {
  prompt([
    {
      type: "input",
      name: "department_name",
      message: "Enter the name of the new department:",
    },
  ]).then(answer => {
    const sql = `INSERT INTO department (department_name) VALUES (?)`;
    db.query(sql, [answer.department_name], (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`Department '${answer.department_name}' added.`);
      mainMenu();
    });
  });
};


// create new role
const addRole = () => {
  prompt([
    {
      type: "input",
      name: "title",
      message: "Enter the name of the new role:",
    },
    {
      type: "number",
      name: "salary",
      message: "Enter the salary of the new role:",
      validate: value => {
        if (Number.isInteger(value)) {
          return true;
        }
        return "Please enter a number.";
      },
    },
    {
      type: "number",
      name: "department_id",
      message: "Enter the department ID for the new role:",
      validate: value => {
        if (Number.isInteger(value)) {
          return true;
        }
        return "Please enter a valid department ID.";
      },
    },
  ]).then(answer => {
    const { title, salary, department_id } = answer;
    const sql = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
    db.query(sql, [title, salary, department_id], (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`Role '${answer.title}' added.`);
      mainMenu();
    });
  });
};


// want to implement is_manager input
const addEmployee = () => {
  prompt ([
    {
      type: "input",
      name: "first_name",
      message: "Enter the new employee's first name:"
    },
    {
      type: "input",
      name: "last_name",
      message: "Enter the new employee's last name:"
    },
    {
      type: "input",
      name: "role_id",
      message: "Enter the new employee's role ID:"
    },
    {
      type: "input",
      name: "manager_id",
      message: "Enter the new employee's manager ID:"
    },
  ]).then(input => {
    const { first_name, last_name, role_id, manager_id } = input;
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
    db.query(sql, [first_name, last_name, role_id, manager_id], (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`Employee '${first_name} ${last_name}' added.`);
      mainMenu();
    });
  });
}


// updates an employee's role
const updateEmployeeRole = () => {
  prompt([
    {
      type: "input",
      name: "employee_id",
      message: "Enter the employee's ID:",
      validate: value => {
        if (Number.isInteger(parseInt(value))) {
          return true;
        }
        return "Invalid input.";
      }
    },
    {
      type: "input",
      name: "role_id",
      message: "Enter ID of the new role:",
      validate: value => {
        if (Number.isInteger(parseInt(value))) {
          return true;
        }
        return "Invalid input.";
      }
    }
  ]).then(answer => {
      const { employee_id, role_id } = answer;
      const checkRole = "SELECT * FROM role WHERE id = ?";
      db.query(checkRole, [role_id], (roleCheckErr, roleCheckResult) => {
        if (roleCheckErr) {
          console.error(roleCheckErr);
          return;
        }
        if (roleCheckResult.length === 0) {
          console.log(`Role ID ${role_id} does not exist.`);
          mainMenu();
        } else {
          const updateSql = "UPDATE employee SET role_id = ? WHERE id = ?";
          db.query(updateSql, [role_id, employee_id], (updateErr, updateResult) => {
            if (updateErr) {
              console.error(updateErr);
              return;
            }
            if (updateResult.affectedRows === 0) {
              console.log(`Employee ID not found.`);
            } else {
              console.log(`Role ID has successfully been updated.`);
            }
            mainMenu();
          });
        }
      });
    });
};