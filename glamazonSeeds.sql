INSERT INTO products (product_name,department_name,price,stock_quantity,product_sales)
VALUES ("Enchanted","Movies",19.99,50,99.95),
        ("The Sound of Music","Movies",19.99,52,99.95),
        ("Harry Potter and the Sorceror's Stone","Books",10.99,100,186.83),
        ("Midnight Tides","Books",6.99,23,20.97),
        ("Scythe","Toys & Games",56.00,36,168.00),
        ("Echo Dot","Electronics",50.99,350,1070.79),
        ("Mad Dash","Video Games",19.99,15,59.97),
        ("Skyrim","Video Games",49.99,47,199.96),
        ("Legend of Zelda: Breath of the Wild","Video Games",59.99,187,299.95),
        ("The Night Circus","Books",14.49,2,86.94);
        
SELECT * FROM products;

INSERT INTO departments (department_name,over_head_costs)
VALUES ("Movies",100.33),
        ("Books",50.99),
        ("Toys & Games",79.99),
        ("Electronics",80.99),
        ("Video Games",59.99);