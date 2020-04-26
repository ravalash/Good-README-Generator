const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const download = require('download');



const gatherInfo = async () => {
  const { username } = await inquirer.prompt({
    message: "Enter your GitHub username",
    name: "username"
  })
  const queryUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
  const userUrl = `https://api.github.com/users/${username}`;
  let res = await axios.get(queryUrl)
  const githubRepoData = res.data;
  const githubRepos = [];
  res.data.forEach(element => {
    githubRepos.push(element.name);
  });
  const { repository } = await inquirer.prompt({
    type: 'list',
    message: "Choose a repository",
    choices: githubRepos,
    name: "repository"
  })
  let description;
  let currentLicense;
  githubRepoData.forEach(element => {
    if (element.name === repository) {
      description = element.description;
      currentLicense = element.license;
    }
  })
  let res1 = await axios.get(userUrl)
  let email = res1.data.email;
  const avatar = res1.data.avatar_url;
  if (email === null) {
    await inquirer.prompt({
      name: "emailAddress",
      message: `No email address detected on Github. Enter your email address:\n`
    }).then(function ({ emailAddress }) {
      email = emailAddress
    })
  }
  console.log(email);
  console.log(`Instructions will be entered line by line. Press ENTER (no input) at any time to end instructions`);
  const instructions = await buildInstructions();
  let keep;
  console.log(instructions);
  const { usage } = await inquirer.prompt({
    name: "usage",
    message: `Enter details for the 'Usage' section of your Readme file. Usage will be presented as written.\n`
  })
  if (currentLicense != null) {
    keep = await inquirer.prompt({
      name: "keep",
      message: `Existing license detected as ${currentLicense.name}. Do you wish to keep this liscense?\n`,
      type: "confirm"
    })
  }
  else {
    keep = true;
  }
  if (currentLicense === null || !keep) {
    console.log("No existing license detected. A number of default options are available\nThe MIT license is simple and permissiive\nThe GNU GPLv3 license alllows most use except for distributing closed source versions")
    const { license } = await inquirer.prompt({
      name: "license",
      message: "Please choose a licensing option from the choices below:",
      choices: ["MIT License", "GNU GPLv3", "None"],
      type: "list"
    })
    console.log(license);
  }
  const { contributorStandard } = await inquirer.prompt({
    name: "contributorStandard",
    type: "confirm",
    message: "The 'Contributor Convenant' is an industry recccomended standard for guidelines on how to contribute. Would you like to use this?"
  })
  console.log(contributorStandard);
  let contributor = "";
  if (contributorStandard === false) {
    const { contributeText } = await inquirer.prompt({
      name: "contributeText",
      message: `Enter details for `
    })
    contributor = contributeText;
  }
  else {
    await downloadCOC(email);
    contributor =
      `Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.\nAvailable for reference at "./code_of_conduct.md"`
  }
}




const buildInstructions = async () => {
  let stop = false;
  const instructionList = [];
  while (!stop) {
    const { instruction } = await inquirer.prompt({
      name: "instruction",
      message: `Enter instructions for line ${instructionList.length + 1}:\n`
    })
    if (instruction === "") {
      stop = true;
      return new Promise((resolve) => {
        resolve(instructionList);
      })
    }
    else {
      instructionList.push(instruction);
    }
  }
}

const downloadCOC = (async (email) => {
  await download('https://www.contributor-covenant.org/version/2/0/code_of_conduct/code_of_conduct.md', "./");
  fs.readFile("./code_of_conduct.md", "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }
    const cocText = data.replace("[INSERT CONTACT METHOD]", email);
    fs.writeFile("code_of_conduct.md", cocText, function (err) {
      if (err) {
        console.log(err);
      }
    })
  })
})


gatherInfo();