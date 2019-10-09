// requiring Inquirer and also the other js files
var inquirer = require("inquirer");
var supervisor = require("./glamazonSupervisor.js");
var manager = require("./glamazonManager.js");
var customer = require("./glamazonCustomer.js");

// inquirer to select a job and kick off the whole app
inquirer
.prompt([
    {
        type: "list",
        message: "What is your job position?",
        choices: ['Customer','Manager','Supervisor'],
        name: "jobTitle"
    }
]).then(function(ans){
    switch(ans.jobTitle){
        case "Customer":
            customer();
            break;
        case "Manager":
            manager();
            break;
        case "Supervisor":
            supervisor();
            break;
    }
}).catch(function(error){
    console.log(error);
})
