# Good-README-Generator
![Github Issues](https://img.shields.io/github/issues/ravalash/Good-README-Generator)![Github Forks](https://img.shields.io/github/forks/ravalash/Good-README-Generator)![Github Stars](https://img.shields.io/github/stars/ravalash/Good-README-Generator)![Github Issues](https://img.shields.io/github/license/ravalash/Good-README-Generator)

## Description
Week 9 Homework - Good README Generator

## Motivation
THis homework will deliver a README generator using input from the user to customize the file appropriately. This will serve as an opportunity to work with Node.js and asynchronous functions in JavaScript.

## Code Style
This project is written using JavaScript and takes advantage of the Async/Await functionality introduced in ES2017 to resolve promises without chaining multiple then methods. Because most promises need to be resolved sequentially, little is lost in performance by not forcing them to run in parallel.

```javascript
const { username } = await inquirer.prompt({
    message: "Enter your GitHub username",
    name: "username"
  })
  ```

  Similarly, await is used within other methods to allow processing of data before completing a task.

  ```javascript
  else if (license === "GNU GPLv3") {
    fs.writeFileSync("./LICENSE", await download("https://www.gnu.org/licenses/gpl-3.0.txt"));
    return `Copyright (C) ${new Date().getFullYear()} ${userName}\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\n(at your option) any later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU General Public License for more details.\n\nYou should have received a copy of the GNU General Public License\nalong with this program.  If not, see <https://www.gnu.org/licenses/>.`
  }
  ```

Data is pulled from the user's public facing Github information to generate available content like repository choice to set title and description.

![Repository Selection Screenshot](/screenshots/repositories.JPG "Repository Selection")

Some input allows the user to continue to build an array with a set condition to end additional lines which allows the data to be converted to a list.

![Instruction Entering Screenshot](/screenshots/instructions.JPG "Instructions List")

Other choices are boolean which is used to inform other future choices.

![Contributor Covenant Screenshot](/screenshots/contributor.JPG "Contributor Selection")


## Features
Lengthy files are downloaded and written to the users source folder to avoid having to save unnecessary assets that will go unused.

Available information that can be gathered via Github's API call is used to build the README file. For user's that do not have information publicly available, error trapping is used to make sure values are captured.

Badges are generated dynamicly and will update values as repo information changes.

# How to Use
Dependencies must be installed individually or via package.json file
* fs
* inquirer
* axios
* download

Execution is completed by running index.js and entering information in the CLI.

  