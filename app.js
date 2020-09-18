const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { restoreDefaultPrompts } = require("inquirer");

const employees = [];

managerPrompt();

function managerPrompt() {
    return inquirer.prompt([
        {
            type: "input",
            name: "managerName",
            message: "What is the name of the manager for this project?"
        },
        {
            type: "input",
            name: "managerEmail",
            message: "What is the manager's email address?"
        },
        {
            type: "input",
            name: "office",
            message: "What is the manager's office number?"
        }
    ]).then(result => {
        const manager = new Manager(result.managerName, 1, result.managerEmail, result.office);

        employees.push(manager);

        userPrompts();
    });
}

function userPrompts() {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the next team member?"
        },
        {
            type: "list",
            name: "role",
            message: "What is this person's role in this project?",
            choices: [
                'Engineer',
                'Intern'
            ]
        },
        {
            type: "input",
            name: "email",
            message: "What is this person's email address?"
        },
    ]).then(result => rolePrompts(result));
}    
    
function rolePrompts(result) {
    if(result.role === "Engineer") {
        return inquirer.prompt([
            {
                type: "input",
                name: "github",
                message: "What is this engineer's GitHub profile URL?"
            }
        ]).then(engineerResult => {
            const id = employees.length + 1;
            const engineer = new Engineer(result.name, id, result.email, engineerResult.github);

            employees.push(engineer);

            repeat();
        });
    } else {
        return inquirer.prompt([
            {
                type: "input",
                name: "school",
                message: "What is this intern's school name?"
            }
        ]).then(internResult => {
            const id = employees.length + 1;
            const intern = new Intern(result.name, id, result.email, internResult.school);

            employees.push(intern);

            repeat();
        });
    }
};
    
function repeat() {
    return inquirer.prompt([
        {
            type: "list",
            name: "continue",
            message: "Is there another team member?",
            choices: [
                "Yes",
                "No"
            ]
        }
    ]).then(result => {
        if(result.continue === "Yes"){
            userPrompts();
        } else {
            fs.writeFileSync(outputPath, render(employees), "utf-8")
        };
    })
}



// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
