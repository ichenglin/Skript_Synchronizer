const fetch = require("node-fetch");
const cheerio = require("cheerio");

module.exports = getClientLoginCertificate;

async function getClientLoginCertificate(loginCredential) {

    const preLoginCertificate = await fetch("https://playerservers.com/login")
    .then(async response => {

        const rawHtml = await response.text();
        const $ = cheerio.load(rawHtml);
        const loginCertificateToken = $("input[name=token]").val();
        const loginCertificateSession = response.headers.raw()["set-cookie"][0].match(/PHPSESSID=(\w+)/)[1];

        return {
            token: loginCertificateToken,
            session: loginCertificateSession
        };

    });

    const loginParameters = new URLSearchParams();
    loginParameters.append("username", loginCredential.username);
    loginParameters.append("password", loginCredential.password);
    loginParameters.append("token", preLoginCertificate.token);

    const finalLoginCertificate = await fetch("https://playerservers.com/login", {
        
        method: "POST",
        body: loginParameters,
        headers: {
            cookie: "PHPSESSID=" + preLoginCertificate.session + ";"
        }

    })
    .then(async response => {

        const rawHtml = await response.text();
            
        if (rawHtml.includes("window.location.replace(\"")) {
            return {
                success: true,
                session: preLoginCertificate.session
            };
        }

        return {
            success: false
        };

    });

    return finalLoginCertificate;

}