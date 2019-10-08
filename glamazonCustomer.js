function customer(){
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



// function to display the items available for purchase:
function displayStore() {


  connection.query("SELECT * FROM products", function (error, response) {
    if (error) throw error;
    // displaying everything all nice and friendly like
    console.log("GLAMAZON PRODUCTS");
    var table = new Table({
      head: ["Item ID","Product Name","Price"],
      colWidths: [10,50,10]
    });

    

    for (var i = 0; i < response.length; i++) {
      table.push(
        [response[i].item_id,response[i].product_name,`$${response[i].price}`]
      )
    }
    console.log(table.toString());
  })
}






function updateSales(id, price, boughtNum) {
  connection.query(`UPDATE products SET product_sales = product_sales + ${price * boughtNum} WHERE item_id=?`, [id], function (error, res) {
    if (error) throw error;
  })
  connection.end();
}

// function to display how much the user spent (to be called only after a purchase goes through):
// accepts two arguments: the item's unique id (id) and the number of that item purchased (boughtNum)
function displayPrice(id, boughtNum) {
  connection.query("SELECT * FROM products WHERE item_id=?", [id], function (error, response) {
    if (error) throw error;
    console.log(`You spent $${response[0].price * boughtNum}!`);
    updateSales(id, response[0].price, boughtNum);
  })
}

// function to update the stock after the user successfully purshases items:
// accepts three arguments: the number of items currently in stock (quantity), the item's unique id (id), and the number of that item purchased (boughtNum)
function updateStock(quantity, id, boughtNum) {
  if (quantity === 0) {
    // if the item is out of stock, call the removeProduct function to delete the listing
    removeProduct(id);
  }
  else {
    // query to update the stock with the new total number (which is actually calculated in the customerBuys function below)
    connection.query("UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: quantity
        },
        {
          item_id: id
        }
      ],
      function (err, res) {
        if (err) throw err;
        // calls the display cost function to show the user how much they spent
        displayPrice(id, boughtNum);
      }
    );
  }
}

// function to delete an item that is out of stock:
// takes one argument, the item id
function removeProduct(id) {
  console.log(id);
  connection.query(
    "DELETE FROM products WHERE item_id=?", [id], function (err, res) {
      if (err) throw err;
      // show the updated contents of the store
      displayStore();
    }
  );
  connection.end();
}

// function that allows customer to purchase items:
function customerBuys() {
  inquirer
    .prompt([
      {
        name: "selectID",
        message: "Please enter the ID number of the product you'd like to buy.",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          } else {
            return false;
          }
        }
      },
      {
        name: "howMany",
        message: "How many would you like to purchase?",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          } else {
            return false;
          }
        }
      }
    ]).then(function (ans) {
      connection.query("SELECT * FROM products WHERE item_id=?", [parseInt(ans.selectID)], function (error, res) {
        if (error) throw error;
        // variable to store how many items would be left if the customer were to purchase the number they want:
        var remaining = res[0].stock_quantity - parseInt(ans.howMany);
        // if there are enough items in stock to accomodate the number the user wants to buy:
        if (remaining >= 0) {
          // call the updateStock function with the item's id and how many the user wants to buy (grabbed from Inquirer)
          updateStock(remaining, res[0].item_id, parseFloat(ans.howMany));
        } else {
          console.log(`We're sorry, there is not enough of ${res[0].product_name} in stock to purchase that many.`);
          connection.end();
        }
      });
    }).catch(function (err) {
      console.log(err);
    })
}

// function to establish the database connection:
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  // call displayStore to show user what products are available
  displayStore();
  // call customerBuys to kick off the path to purchase
  customerBuys();
});

// portfolio link: https://noracbyrd.github.io/Bootstrap_Portfolio/
}
module.exports = customer;