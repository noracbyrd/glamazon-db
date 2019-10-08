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

// don't forget to end connection!
function viewSales(){
    //join shit
}

// don't forget to end connection!
function createDept(){
    //insert shit
}

inquirer
    prompt([
        {
            message: "Select a task",
            type: "list",
            choices: ["View Product Sales by Department","Create New Department"],
            name: "task"
        }
    ]).then(function(ans){
        switch(ans.task){
            case "View Product Sales by Department":
                viewSales();
                break;
            case "Create New Department":
                createDept();
                break;
        }
    }).catch(function(err){
        console.log(err);
    })
