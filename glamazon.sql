CREATE DATABASE glamazon;
USE glamazon;

CREATE TABLE products(
    item_id INTEGER(10) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL, 
    stock_quantity INTEGER(10) NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Enchanted","Movies",19.99,50),
        ("The Sound of Music","Movies",19.99,52),
        ("Harry Potter and the Sorceror's Stone","Books",10.99,100),
        ("Midnight Tides","Books",6.99,23),
        ("Scythe","Toys & Games",56.00,36),
        ("Echo Dot","Electronics",50.99,350),
        ("Mad Dash","Video Games",19.99,15),
        ("Skyrim","Video Games",49.99,47),
        ("Legend of Zelda: Breath of the Wild","Video Games",59.99,187),
        ("Midnight Circus","Books",14.49,2);
        
SELECT * FROM products;