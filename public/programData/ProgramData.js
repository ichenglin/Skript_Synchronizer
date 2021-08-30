const {app} = require("electron");
const FileSystem = require("fs");

class ProgramData {

    constructor(fileName) {

        this.program_file_name = fileName;
        this.program_file_directory = app.getPath("userData");
        this.program_file_path = this.program_file_directory + "/" + this.program_file_name;
        this.namespace = {};

    }

    writeProgramData(key, value) {

        let programFileContent = readRawData(this.program_file_path);
        programFileContent[key] = value;
        FileSystem.writeFileSync(this.program_file_path, JSON.stringify(programFileContent, undefined, "\t"));
        //FileSystem.writeFileSync(this.program_file_path, JSON.stringify(programFileContent));

    }

    readProgramData(key) {

        return readRawData(this.program_file_path)[key];

    }

    removeProgramData(key) {

        let programFileContent = readRawData(this.program_file_path);
        programFileContent[key] = undefined;
        FileSystem.writeFileSync(this.program_file_path, JSON.stringify(programFileContent));

    }

    definedProgramData(key) {
        
        return (readRawData(this.program_file_path, false)[key] ? true : false);

    }

}

function readRawData(programFilePath, fallbackDefined) {

    let programFileContent;
    try {
        programFileContent = JSON.parse(FileSystem.readFileSync(programFilePath));
    } catch (error) {
        programFileContent = (fallbackDefined != false && {});
    }
    return programFileContent;

}

module.exports = ProgramData;