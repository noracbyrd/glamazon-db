// requiring npm packages
const inquirer = require("inquirer");
const mysql = require("mysql");

// establishing a connections to the database
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

// function to display the items available for purchase
function displayItems(){
  connection.query("SELECT * FROM products", function(error,response){
    if (error) throw error;
    // displaying everything all nice and friendly like
    console.log("GLAMAZON PRODUCTS");
    for (var i = 0; i<response.length; i++){
      console.log(`ID: ${response[i].item_id} \t Product Name: ${response[i].product_name}; Price: $${response[i].price}`);
    }
  })
}

// function that allows customer to purchase items
function customerBuys() {
  inquirer
  .prompt([
    {
      name: "selectID",
      message: "Please enter the ID number of the product you'd like to buy."
      // need to validate that they entered a number, ugh
    },
    {
      name: "howMany",
      message: "How many would you like to purchase?"
      // again, need to validate that they entered a number
    }
  ]).then(function(ans){
    // probably need to convert the answers into integers
    // if statement: if there's enough stock-
    // update the database, console log the price of the purchase
    // else say 'not enough stock, sorry"
  }).catch(err,function(){})
}

// function to establish the database connection
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  displayItems();
  customerBuys();
  connection.end();
});

