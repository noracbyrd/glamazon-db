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


function viewSales(){
    //join shit
    connection.query("SELECT departments.department_id,departments.department_name,SUM(departments.over_head_costs),SUM(products.product_sales),(SUM(products.product_sales)-SUM(departments.over_head_costs)) as total_profit FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY department_id",function(err,response){
        if (err) throw err;
        // need to somehow display this nicely
        console.log(response);
    })
    connection.end();
}


function createDept(){
    //insert shit
    inquirer
    .prompt([
        {
            message: "What department would you like to add?",
            name: "newDept"
        },
        {
            message: "What are the department's overhead costs?",
            name: "deptCosts"
            // need validation
        },
    ]).then(function (ans) {
        connection.query("INSERT INTO departments SET ?",
            {
                department_name: ans.newDept,
                over_head_costs: parseFloat(ans.deptCosts)
            },
            function (error, response) {
                if (error) throw error;
                viewSales();
            })
    }).catch(function (error) {
        console.log(error);
    })
}

inquirer
    .prompt([
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
