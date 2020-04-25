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
          axios.get(userUrl).then(function(res) {
            const email = res.data.email;
            const avatar = res.data.avatar_url;    
          })
        })

      }).catch(function (error) {
        console.log(error.message);
      });
  });


  // const githubString = githubRepos.join("\n");
  // fs.writeFile(`repos.txt`, githubString, function (err) {
  //   if (err) {
  //     throw err;
  //   }
  //   console.log("Write successful");
  // })