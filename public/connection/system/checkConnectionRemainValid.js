const fetch = require("node-fetch");

module.exports = checkConnectionRemainValid;

async function checkConnectionRemainValid(loginCertificate) {

    return await fetch("https://playerservers.com/dashboard/filemanager/&dir=/", {

        headers: {
            cookie: "PHPSESSID=" + loginCertificate.session + ";"
        }

    })
    .then(async response => {

        const rawHtml = await response.text();
        
        return !(rawHtml.includes("window.location.replace(\"/account/\");"));

    });

}