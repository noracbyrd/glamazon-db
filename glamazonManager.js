function manager() {
// requiring npm packages
const inquirer = require("inquirer");
const mysql = require("mysql");
var Table = require('cli-table');

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



// function to view all products:
function viewProducts() {
    connection.query("SELECT * FROM products", function (error, response) {
        if (error) throw error;
        // displaying everything all nice and friendly like
        console.log("GLAMAZON PRODUCTS");
        var table = new Table({
            head: ["Item ID","Product Name","Price","# in Stock"],
            colWidths: [10,50,10,15]
          });
        for (var i = 0; i < response.length; i++) {

            table.push(
                [response[i].item_id,response[i].product_name,`$${response[i].price}`,response[i].stock_quantity]
            )
        }
        console.log(table.toString());
    })
    connection.end();
}

// function to view all products whose stock is under 5: 
function viewLow() {
    connection.query("SELECT * FROM products", function (error, response) {
        if (error) throw error;
        console.log("LOW INVENTORY");
        var table = new Table({
            head: ["Item ID","Product Name","Price","# in Stock"],
            colWidths: [10,50,10,15]
          });
        var tracker = 0;
        for (var i = 0; i < response.length; i++) {
            if (response[i].stock_quantity < 5) {
                table.push(
                    [response[i].item_id,response[i].product_name,`$${response[i].price}`,response[i].stock_quantity]
                )
                tracker++;
            }
        }
        console.log(table.toString());
        if (tracker === 0) {
            console.log("No low inventory!");
        }
    })
    connection.end();
}

var getDeptOptions = function() {
    connection.query("SELECT department_name FROM departments GROUP BY department_name", function (error, response){
        if (error) throw error;
        let options = [];
        for (var i = 0; i< response.length; i++){
            options.push(response[i].department_name);
        }
        console.log(options);
        return options;
    })
}




function addInventory() {
    inquirer
        .prompt([
            {
                message: "What is the ID of the item you'd like to add inventory to?",
                name: "itemID",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            {
                message: "How many would you like to add?",
                name: "howMany",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        ]).then(function (ans) {
            connection.query(`UPDATE products SET stock_quantity = stock_quantity + ${parseInt(ans.howMany)} WHERE item_id=?`, [parseInt(ans.itemID)],
                function (error, res) {
                    if (error) throw error;
                    console.log("Stock added!");
                })
            viewProducts();
        }).catch(function (error) {
            console.log(error);
        })
}


function addProduct() {
    var deptOptions = getDeptOptions();
    inquirer
        .prompt([
            {
                message: "What item would you like to add?",
                name: "newItem",
                validate: function (value) {
                    if (isNaN(value) === true) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            {
                message: "In what department should the product be placed?",
                name: "itemDept",
                // type: "list",
                // choices: `${deptOptions}`
                // need a way to validate if the department exists
            },
            {
                message: "How much does the item cost?",
                name: "itemPrice",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            {
                message: "How many of this item are in stock?",
                name: "itemsInStock",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        return false;
                    }
                }
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
}
module.exports = manager;