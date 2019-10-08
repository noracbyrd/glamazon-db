var customer = require("./glamazonCustomer.js");
var inquirer = require("inquirer");
var supervisor = require("./glamazonSupervisor.js");
var manager = require("./glamazonManager.js");

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
