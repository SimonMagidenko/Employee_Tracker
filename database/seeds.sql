INSERT INTO department (department_name) 
Values 
('Human Resources'),
('Finance'),
('Accounting'),
('Marketing'),
('Sales'),
('Operations'),
('Information Technology');


INSERT INTO role (title, salary, department_id)
Values 
('HR Manager', 70000, 1),
('HR Specialist', 50000, 1),
('Finance Manager', 80000, 2),
('Accountant', 55000, 2),
('Marketing Manager', 75000, 3),
('Marketing Coordinator', 45000, 3),
('Sales Director', 90000, 4),
('Sales Executive', 55000, 4),
('Operations Coordinator', 60000, 5),
('Supply Chain Manager', 50000, 5),
('IT Director', 95000, 6),
('Software Developer', 70000, 6),
('Network Administrator', 60000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
Values
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Michael', 'Johnson', 3, NULL),
('Emily', 'Williams', 4, 3),
('David', 'Brown', 5, NULL),
('Olivia', 'Jones', 6, 5),
('Daniel', 'Martinez', 7, NULL),
('Sophia', 'Anderson', 8, 7),
('William', 'Taylor', 9, NULL),
('Ava', 'Hernandez', 10, 9),
('James', 'Garcia', 11, NULL),
('Mia', 'Lopez', 12, 11),
('Ethan', 'Perez', 13, 11);