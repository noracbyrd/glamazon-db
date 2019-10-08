// requiring npm packages
const inquirer = require("inquirer");
const mysql = require("mysql");

// establishing a connection to the database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "glamazon"
});

function currentStock(id){
connection.query("SELECT * FROM products WHERE item_id=?", [id], function(error,res){
    if (error) throw error;
    return res[0].stock_quantity;
})
}

// function to view all products:
function viewProducts() {
    connection.query("SELECT * FROM products", function (error, response) {
        if (error) throw error;
        // displaying everything all nice and friendly like
        console.log("GLAMAZON PRODUCTS");
        for (var i = 0; i < response.length; i++) {
            console.log(`ID: ${response[i].item_id} \t Product Name: ${response[i].product_name}; Price: $${response[i].price} \t In Stock: ${response[i].stock_quantity}`);
        }
    })
    connection.end();
}

// function to view all products whose stock is under 5: 
function viewLow() {
    connection.query("SELECT * FROM products", function (error, response) {
        if (error) throw error;
        console.log("LOW INVENTORY");
        var tracker = 0;
        for (var i = 0; i < response.length; i++) {
            if (response[i].stock_quantity < 5) {
                console.log(`ID: ${response[i].item_id} \t Product Name: ${response[i].product_name}; Price: $${response[i].price} \t In Stock: ${response[i].stock_quantity}`);
                tracker++;
            }
        }
        if (tracker === 0) {
            console.log("No low inventory!");
        }
    })
    connection.end();
}



function addInventory() {
    inquirer
        .prompt([
            {
                message: "What is the ID of the item you'd like to add inventory to?",
                name: "itemID"
                // validation, eurgh
            },
            {
                message: "How many would you like to add?",
                name: "howMany"
                // validation, ugh
            }
        ]).then(function (ans) {
            connection.query("UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: (currentStock(parseInt(ans.itemID))+parseInt(ans.howMany))
                },
                {
                    item_id: parseInt(ans.itemID) 
                }
            ],
                function(error,res){
                if (error) throw error;
                    console.log("Stock added!");
            }) 
            viewProducts();
        }).catch(function(error){
            console.log(error);
         })
}


function addProduct() {
    inquirer
        .prompt([
            {
                message: "What item would you like to add?",
                name: "newItem"
            },
            {
                message: "In what department should the product be placed?",
                name: "itemDept"
            },
            {
                message: "How much does the item cost?",
                name: "itemPrice"
                // need a bloody validation
            },
            {
                message: "How many of this item are in stock?",
                name: "itemsInStock"
                // need bloody validation
            }
        ]).then(function (ans) {
            connection.query("INSERT INTO products SET ?",
                {
                    product_name: ans.newItem,
                    department_name: ans.itemDept,
                    price: parseFloat(ans.itemPrice),
                    stock_quantity: parseInt(ans.itemsInStock),
                    product_sales: 0.00
                },
                function (error, response) {
                    if (error) throw error;
                    viewProducts();
                })
        }).catch(function (error) {
            console.log(error);
        })
}



// run Inquirer to select a task:
function selectTask() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Select a task:",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
                name: "task"
            }
        ]).then(function (ans) {
            switch (ans.task) {
                case "View Products for Sale":
                    viewProducts();
                    break;
                case "View Low Inventory":
                    viewLow();
                    break;
                case "Add to Inventory":
                    addInventory();
                    break;
                case "Add New Product":
                    addProduct();
                    break;
            }
        }).catch(function (err) {
            console.log(err);
        });
}

// function to establish the database connection:
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // call selectTask to kick off the program
    selectTask();
});
