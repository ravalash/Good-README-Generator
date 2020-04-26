const fs = require("fs");
const download = require('download');



const test = (async () => {
    await download('https://www.contributor-covenant.org/version/2/0/code_of_conduct/code_of_conduct.md', "./");
    fs.readFile("./code_of_conduct.md", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        const cocText = data.replace("[INSERT CONTACT METHOD]", "parsons.adamj@gmail.com");
        fs.writeFile("code_of_conduct.md", cocText, function (err) {
            if (err) {
                console.log(err);
            }
        })
    })
})

test();