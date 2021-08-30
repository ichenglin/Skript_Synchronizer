module.exports = randomString;

function randomString(length, excludeStrings) {

    excludeStrings = excludeStrings || [];

    const availableCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let generatedCharacters = [];

    while (generatedCharacters.length <= 0 || excludeStrings.includes(generatedCharacters.join(""))) {

        generatedCharacters = [];

        for (let loopRandomCharacterIndex = 0; loopRandomCharacterIndex < length; loopRandomCharacterIndex++) {
            generatedCharacters.push(availableCharacters[Math.floor(Math.random() * availableCharacters.length)]);
        }

    }

    return generatedCharacters.join("");

}