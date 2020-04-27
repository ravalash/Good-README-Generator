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
  let userName = res1.data.name;
  const avatar = res1.data.avatar_url;
  if (email === null) {
    await inquirer.prompt({
      name: "emailAddress",
      message: `No email address detected on Github. Enter your email address:\n`
    }).then(function ({ emailAddress }) {
      email = emailAddress
    })
  }
  if (userName === null) {
    await inquirer.prompt({
      name: "enteredName",
      message: `A full name was not detected on Github. Enter your full name:\n`
    }).then(function ({ enteredName }) {
      userName = enteredName;
    })
  }
  console.log(`Instructions will be entered line by line. Press ENTER (no input) at any time to end instructions`);
  const instructions = await buildInstructions();
  console.log(instructions);
  const { usage } = await inquirer.prompt({
    name: "usage",
    message: `Enter details for the 'Usage' section of your Readme file. Usage will be presented as written.\n`
  })
  let keep = false;
  if (currentLicense != null) {
    keep = await inquirer.prompt({
      name: "keep",
      message: `Existing license detected as ${currentLicense.name}. Do you wish to keep this liscense?\n`,
      type: "confirm"
    })
  }
  let license = "";
  if (!keep) {
    console.log("A number of default license options are available\nThe MIT license is simple and permissiive\nThe GNU GPLv3 license alllows most use except for distributing closed source versions")
    const { licenseChoice } = await inquirer.prompt({
      name: "licenseChoice",
      message: "Please choose a licensing option from the choices below:",
      choices: ["MIT License", "GNU GPLv3", "None"],
      type: "list"
    })
    license = licenseChoice;
  }
  else {
    license = currentLicense.name;
  }
  const licenseText = await buildLicense(license, userName);
  const { contributorStandard } = await inquirer.prompt({
    name: "contributorStandard",
    type: "confirm",
    message: `The 'Contributor Convenant' is an industry recccomended standard for guidelines on how to contribute. Would you like to use this?\n`
  })
  let contributor = "";
  if (contributorStandard === false) {
    const { contributeText } = await inquirer.prompt({
      name: "contributeText",
      message: `Enter details for other developers regarding contribution to your project:\n`
    })
    contributor = contributeText;
  }
  else {
    await downloadCOC(email);
    contributor =
      `Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.\nAvailable for reference [here](../code_of_conduct.md).`
  }
  const { tests } = await inquirer.prompt({
    name: "tests",
    message: `Enter details for any tests included with your project as well as how to run them:\n`
  })
  const readmeText = `# ${repository}\n![Github Issues](https://img.shields.io/github/issues/${username}/${repository})![Github Forks](https://img.shields.io/github/forks/${username}/${repository})![Github Stars](https://img.shields.io/github/stars/${username}/${repository})![Github Issues](https://img.shields.io/github/license/${username}/${repository})\n\n## Description\n${description}\n\n## Table of Contents\n* [Installation](#installation)\n* [Usage](#usage)\n* [License](#license)\n* [Contributing](#contributing)\n* [Tests](#tests)\n* [Questions](#questions)\n\n## Installation\n1. ${instructions.join("\n1. ")}\n\n## Usage\n${usage}\n\n## License\n${licenseText}\n\n## Contributing\n${contributor}\n\n## Tests\n${tests}\n\n## Questions\nFor questions about this project, please contact me at <${email}>\n![User Avatar](${avatar} "User Avatar")`
  await fs.writeFile("goodREADME.md", readmeText, function (err) {
    if (err) {
      console.log(err);
    }
  });
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
      return(instructionList);
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

const buildLicense = (async (license, userName) => {
  if (license === "None") {
    return "No explicit license has been provided for use of this program privately or publicly."
  }
  else if (license === "MIT License") {
    fs.writeFile("./LICENSE", `MIT License\n\nCopyright (c) ${new Date().getFullYear()} ${userName}\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.)`, function (err) {
      if (err) {
        console.log(err);
      }
    })
    return `This project uses the MIT liscense, available for review at <https://opensource.org/licenses/MIT>`
  }
  else if (license === "GNU GPLv3") {
    fs.writeFileSync("./LICENSE", await download("https://www.gnu.org/licenses/gpl-3.0.txt"));
    return `Copyright (C) ${new Date().getFullYear()} ${userName}\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\n(at your option) any later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU General Public License for more details.\n\nYou should have received a copy of the GNU General Public License\nalong with this program.  If not, see <https://www.gnu.org/licenses/>.`
  }
  else {
    return `Copyright (C) ${new Date().getFullYear()} ${userName}\n\nLicense for this project: ${license}`
  }
})

gatherInfo();