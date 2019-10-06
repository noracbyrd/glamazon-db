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

// don't forget to close connection!
function viewProducts(){
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

// don't forget to close connection!
function viewLow(){

}

// don't forget to close connection!
function addInventory(){

}

// don't forget to close connection!
function addProduct(){

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
