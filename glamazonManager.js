// Wrapping everything in a function so that Glamazon can call it!:
function manager() {

    // requiring npm packages
    const inquirer = require("inquirer");
    const mysql = require("mysql");
    var Table = require('cli-table');

    // establishing a connection to the database
    var connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "root",
        database: "glamazon"
    });

    // function to view all products:
    function viewProducts() {
        connection.query("SELECT * FROM products", function (error, response) {
            if (error) throw error;
            // displaying everything all nice and friendly like (thank heavens for cli-table):
            console.log("GLAMAZON PRODUCTS");
            var table = new Table({
                head: ["Item ID", "Product Name", "Price", "# in Stock"],
                colWidths: [10, 50, 10, 15]
            });
            for (var i = 0; i < response.length; i++) {
                table.push(
                    [response[i].item_id, response[i].product_name, `$${response[i].price}`, response[i].stock_quantity]
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
                head: ["Item ID", "Product Name", "Price", "# in Stock"],
                colWidths: [10, 50, 10, 15]
            });
            // flag to keep track of if an item has under 5 inventory
            var tracker = 0;
            for (var i = 0; i < response.length; i++) {
                if (response[i].stock_quantity < 5) {
                    table.push(
                        [response[i].item_id, response[i].product_name, `$${response[i].price}`, response[i].stock_quantity]
                    )
                    // activating the flag if an item's inventory is under 5
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

    // so this function here generates an array of the current existing departments. I was hoping to use it in the inquirer below for adding an item - I wanted to generate a list of choices dynamically of the current departments. Unfortunatly whatever the underlying code in inquirer is, it didn't like my array function, *sniff*. Leaving it here in case I have a brainwave later of how to incorporate it.
    var getDeptOptions = function () {
        connection.query("SELECT department_name FROM departments GROUP BY department_name", function (error, response) {
            if (error) throw error;
            let options = [];
            for (var i = 0; i < response.length; i++) {
                options.push(response[i].department_name);
            }
            return options;
        })
    }

    // function to add stock for a specific item
    function addInventory() {
        inquirer
            .prompt([
                {
                    message: "What is the ID of the item you'd like to add inventory to?",
                    name: "itemID",
                    // yayyyy validation - the below makes sure that only a number is entered
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

    // function to add a new product
    function addProduct() {
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
                    validate: function (value) {
                        if (isNaN(value) === true) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    // type: "list",
                    // choices: deptOptions()
                    // *Sniff*, this is where I would have put my beautiful function to use an array of current department options as the choices array. As it stands, all I can do is validate that they aren't entering a number here. 
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
                // adding the new product to the database
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
        // call selectTask to kick off the program:
        selectTask();
    });
}

//making this whole file accessible to Glamazon!
module.exports = manager;