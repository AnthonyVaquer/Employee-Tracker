INSERT INTO department (name)
VALUES ("Sales"),
       ("Accounting"),
       ("Legal"),
       ("Product Development"),
       ("HR"),
       ("Customer Service"),
       ("IT/Software"),
       ("Marketing"),
       ("C-Suite");

INSERT INTO role (role, department)
VALUES ("Head of Sales", 175000, 1),
       ("Account Manager", 75000, 1),
       ("Controller", 150000, 2),
       ("Staff Accountant", 90000, 2),
       ("Accounting Clerking", 60000, 2)
       ("In-house Counsel", 200000, 3),
       ("Head of HR", 130000, 4),
       ("HR Admin", 70000, 4),
       ("Customer Service Representative", 65000, 5),
       ("Head of IT", 175000, 6),
       ("Software Engineer", 125000, 6),
       ("IT Admin", 90000, 6);
       ("Head of Marketing", 125000, 7),
       ("Marketing Specialist", 80000, 7),
       ("Head of Supply Chain", 125000, 8),
       ("Supply Chain Specialist", 80000, 8),
       ("CEO", 400000, 9),
       ("CFO", 300000, 9),
       ("COO", 300000, 9);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Dan", "Carlinsky", 1, null),
       ("Tara", "Dheming", 2, 1),
       ("Ryan", "Sivero", 3, null),
       ("Anthony", "Vaquer", 4, 3),
       ("Jimmy", "Lee", 5, 3),
       ("Alex", "Spiro", 6, null),
       ("Debbie", "Hernandez", 7, null),
       ("Alex", "Boyd", 8, 7),
       ("Chris", "Moss", 9, 1),
       ("Denise", "Leonard", 10, null),
       ("Mike", "Rashid", 11, 10),
       ("Reggie", "Tiza", 12, 10),
       ("Melissa", "Toth", 13, null),
       ("Andrea", "Ramirez", 14, 13),
       ("Pete", "Brown", 15, null),
       ("Brianna", "Lewis", 16, 15),
       ("Desmond", "Bishop", 17, null),
       ("Mika", "Morris", 18, null),
       ("Stan", "Mogren", 19, null)


       