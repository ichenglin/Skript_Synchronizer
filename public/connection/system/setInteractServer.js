const fetch = require("node-fetch");

module.exports = setInteractServer;

async function setInteractServer(serverId, loginCertificate) {

    await fetch("https://playerservers.com/dashboard/?s=" + serverId, {

        headers: {
            cookie: "PHPSESSID=" + loginCertificate.session + ";"
        }

    });

}