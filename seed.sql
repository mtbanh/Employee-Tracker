USE employees_DB;

--Department --
INSERT INTO department(id, name)
VALUES (1, 'Retail'), (2, 'IT'), (3, 'HR'), (4, 'Marketing');

--Role --
INSERT INTO role (id, title, salary, department_id)
VALUES (1, 'Guest Services', 40000, 1), (2, 'Store Manager', 80000, 1), (3, 'Assistant Manager', 45000, 1), 
        (4, 'IT Coordinator', 50000, 2), (5, 'IT Manager', 85000, 2), (6, 'System Admin', 90000, 2), 
        (7,'Staff Manager', 80000, 3), (8,'Executive Manager',95000,3),(9 ,'Social Media', 45000 ,4),(10,'Product Placement',50000,4);

--Employee 
INSERT INTO employee(id, first_name, last_name, role_id, manager_id)
VALUES (1, "Alla", "Arous", 1, null), (6,'John','Smith',1,1),(7,'Sam','Job',5,6),(8,'Steve','Jobs',7,null)