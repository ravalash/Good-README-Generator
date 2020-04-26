const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");


inquirer
  .prompt({
    message: "Enter your GitHub username",
    name: "username"
  })
  .then(function ({ username }) {
    const queryUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
    const userUrl = `https://api.github.com/users/${username}`;
    axios.get(queryUrl)
      .then(function (res) {
        // console.log(res.data);
        const githubRepoData = res.data;
        const githubRepos = [];
        res.data.forEach(element => {
          githubRepos.push(element.name);
        });
        inquirer.prompt({
          type: 'list',
          message: "Choose a repository",
          choices: githubRepos,
          name: "repository"
        }).then(function ({ repository }) {
          let description;
          let currentLicense;
          githubRepoData.forEach(element => {
            if (element.name === repository) {
              description = element.description;
              currentLicense = element.license;
            }
          })
          axios.get(userUrl).then(function (res) {
            const email = res.data.email;
            const avatar = res.data.avatar_url;
            console.log(`Instructions will be entered line by line. Press ENTER (no input) at any time to end instructions`);
            buildInstructions().then(async function(data){
              const instructions = data;
              let keep;
              console.log(instructions);
              const {usage} = await inquirer.prompt({
                name: "usage",
                message: `Enter details for the 'Usage' section of your Readme file. Usage will be presented as written.\n`
              })
              if(currentLicense != null) {
                 keep = await inquirer.prompt({
                  name: "keep",
                  message: `Existing license detected as ${currentLicense.name}. Do you wish to keep this liscense?\n`,
                  type: "confirm"
                })
              }
              else{
                 keep = true;
              }
              if(currentLicense === null || !keep) {
                console.log("No existing license detected. A number of default options are available\nThe MIT license is simple and permissiive\nThe GNU GPLv3 license alllows most use except for distributing closed source versions")
                const {license} = await inquirer.prompt({
                  name: "license",
                  message: "Please choose a licensing option from the choices below:",
                  choices: ["MIT License", "GNU GPLv3", "None"],
                  type: "list"
                })
                console.log(license);
              }
              const {contributorStandard} = await inquirer.prompt({
                name: "contributorStandard",
                type: "confirm", 
                message: "The 'Contributor Convenant' is an industry recccomended standard for guidelines on how to contribute. Would you like to use this?"
              })
              console.log(contributorStandard);

            });
          })
        })
      }).catch(function (error) {
        console.log(error.message);
      });
  });

const buildInstructions = async() => {
  let stop = false;
  const instructionList = [];
  while (!stop) {
    const {instruction} = await inquirer.prompt({
      name: "instruction",
      message: `Enter instructions for line ${instructionList.length + 1}:\n`
    })
    if (instruction === "") {
      stop = true;
      return new Promise((resolve) =>{
        resolve(instructionList);
      }) 
    }
    else {
      instructionList.push(instruction);
    }
  }
}


// const buildInstructions = new Promise(
//   (resolve) => {
//     inquirer.prompt({
//       name: "instruction",
//       message: `Enter instructions for line ${instructions.length + 1}:`
//     }).then(function ({ instruction }) {
//       if (instruction === "STOP") {
//         resolve(instructions);
//       }
//       else {
//         instructions.push(instruction);
//         buildInstructions();
//       }
//     }).catch(function (error) {
//       console.log(error.message)
//     })
//   }
// )

// const githubString = githubRepos.join("\n");
// fs.writeFile(`repos.txt`, githubString, function (err) {
//   if (err) {
//     throw err;
//   }
//   console.log("Write successful");
