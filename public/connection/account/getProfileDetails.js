const fetch = require("node-fetch");
const cheerio = require("cheerio");

module.exports = getProfileDetails;

async function getProfileDetails(loginCertificate) {

    return await fetch("https://playerservers.com/account/", {

        headers: {
            cookie: "PHPSESSID=" + loginCertificate.session + ";"
        }

    })
    .then(async response => {

        const rawHtml = await response.text();
        const $ = cheerio.load(rawHtml);

        const profileUuid = $("a.nav-link.dropdown-toggle img").attr("src").replace(/^https:\/\/cravatar\.eu\/helmavatar\/(.{8})(.{4})(.{4})(.{4})(.{12})\/128.png$/, "$1-$2-$3-$4-$5");
        const profileUsername = $("a.nav-link.dropdown-toggle img").attr("alt");

        return {
            uuid: profileUuid,
            username: profileUsername
        };

    });

}