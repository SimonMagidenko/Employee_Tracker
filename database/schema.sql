DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS department;

CREATE Table department (
id: INT PRIMARY KEY AUTO_INCREMENT
department_name: VARCHAR (60) NOT NULL

);

CREATE Table role (
id INT AUTO_INCREMENT PRIMARY KEY
title VARCHAR (60) NOT NULL
salary INT NOT NULL
department_id INT NOT NULL
FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE


);

CREATE TABLE employee (
id INT AUTO_INCREMENT PRIMARY KEY
first_name VARCHAR (40) NOT NULL
last_name VARCHAR (50) NOT NULL
role_id INT 
manager_id INT 
FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL
FOREIGN KEY (manager_id) REFERENCES employee(id)


);