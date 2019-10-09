// wrapping everything in a function so that Glamazon can run it!:
function supervisor() {

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

    // function that joins the products and departments tables to produce a combined view - includes aliases to display calculated values
    function viewSales() {
        connection.query("SELECT departments.department_id,departments.department_name,SUM(departments.over_head_costs) AS total_costs,SUM(products.product_sales) AS total_sales,(SUM(products.product_sales)-SUM(departments.over_head_costs)) AS total_profit FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY department_id", function (err, response) {
            if (err) throw err;
            console.log("GLAMAZON DEPARTMENT REPORT");
            var table = new Table({
                head: ["Dept ID", "Dept Name", "Overhead Costs", "Product Sales", "Total Profit"],
                colWidths: [10, 20, 20, 15, 15]
            })
            for (var i = 0; i < response.length; i++) {
                table.push(

                    [response[i].department_id, response[i].department_name, `$${response[i].total_costs}`, `$${response[i].total_sales}`, `$${response[i].total_profit}`]

                )
            }
            console.log(table.toString());
            connection.end();
        })
    }

    // function to add a new department
    function createDept() {
        inquirer
            .prompt([
                {
                    message: "What department would you like to add?",
                    name: "newDept",
                    validate: function (value) {
                        if (isNaN(value) === true) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                },
                {
                    message: "What are the department's overhead costs?",
                    name: "deptCosts",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        } else {
                            return false;
                        }
                    }
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
    // inquirer to select a task
    function selectTask(){
    inquirer
        .prompt([
            {
                message: "Select a task",
                type: "list",
                choices: ["View Product Sales by Department", "Create New Department"],
                name: "task"
            }
        ]).then(function (ans) {
            switch (ans.task) {
                case "View Product Sales by Department":
                    viewSales();
                    break;
                case "Create New Department":
                    createDept();
                    break;
            }
        }).catch(function (err) {
            console.log(err);
        })
    }

    // function to establish the database connection:
    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId);
        // call selectTask to kick off the program:
        selectTask();
    });
}

// making the supervisor function accessible to Glamazon!
module.exports = supervisor;