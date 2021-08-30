module.exports = fileNameParameters;

function fileNameParameters(fileFullNameWithExtension) {

    const fileFullNameParameters = fileFullNameWithExtension.match(/^(.+)\.(\w+)$/);

    return {
        success: (fileFullNameParameters ? true : false),
        name: fileFullNameParameters[1],
        extension: fileFullNameParameters[2]
    }

}