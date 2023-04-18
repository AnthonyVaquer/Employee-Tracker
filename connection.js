const mysql = require("mysql2");
const db = mysql.createConnection('mysql://root:rootroot@localhost:3306/departments_db')

const connection = mysql.createConnection({
  host: "localhost",
  // Your username
  user: "root",
  // Your password
  password: "",
  database: "departments_db"
});

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;
