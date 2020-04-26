const fs = require("fs");

const updateCOC = async function () {
    fs.readFile("./assets/code_of_conduct.md", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        const cocText = data.replace("[INSERT CONTACT METHOD]", "parsons.adamj@gmail.com");
        fs.writeFile("test.md", cocText, function (err) {
            if (err) {
                console.log(err);
            }
        })
    })
}

updateCOC();
console.log("done!")