const fetch = require("node-fetch");

module.exports = checkDirectoryExist;

async function checkDirectoryExist(fullDirectoryPath, loginCertificate) {

    return await fetch("https://playerservers.com/queries/list_files/?dir=" + fullDirectoryPath, {

        headers: {
            cookie: "PHPSESSID=" + loginCertificate.session + ";"
        }

    })
    .then(async response => {

        const rawJson = await response.json();

        return (rawJson.error ? false : true);

    })

}