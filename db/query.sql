SELECT 
employee.id, 
employee.first_name, 
employee.last_name, 
role.title, 
role.salary, 
employee.manager_id  
FROM employee 
JOIN role ON employee.role_id = role.id
-- JOIN employee ON employee.manager_id = employee.id;

-- select e.*, m.name as manager_name
-- from employee e left join
--      employee m
--      on e.managerid = m.id

-- ID | Name | Manager Name
-- 1 | Alice | Xavier
-- 2 | Bob | Xavier
-- 3 | Carol | Xavier
-- 4 | Xavier | Zack
-- 5 | Zack | NULL