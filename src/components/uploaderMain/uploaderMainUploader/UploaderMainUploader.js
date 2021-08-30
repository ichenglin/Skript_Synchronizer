const {default: UploaderMainUploaderToggle} = require("./UploaderMainUploaderToggle");
const {default: UploaderMainUploaderPathSelector} = require("./UploaderMainUploaderPathSelector");
const {default: UploaderMainUploaderCommands} = require("./UploaderMainUploaderCommands");
const {default: UploaderMainUploaderReport} = require("./UploaderMainUploaderReport");
const uploaderTheme = require("../../../templates/theme.json");

function UploaderMainUploader({uploaderUploaderSettings, updateUploaderSettings, uploaderUploaderData, uploaderStatus}) {

    let fileUploaderStartupStatus;
    if (uploaderStatus[1]["file-uploader-startup"] && uploaderStatus[1]["file-uploader-startup"] === "starting") {
        fileUploaderStartupStatus = "initializing";
    } else if (uploaderUploaderSettings[1].enabled === true) {
        fileUploaderStartupStatus = "enabled";
    } else {
        fileUploaderStartupStatus = "disabled";
    }

    return (
        <div className="main-uploader">
            <div className="main-uploader-operations" style={{backgroundColor: uploaderTheme.uploader.panel.background}}>
                <UploaderMainUploaderToggle
                    title="Toggle Uploader"
                    value={fileUploaderStartupStatus}
                    toggleCallBack={() => updateUploaderSettings("enabled", !uploaderUploaderSettings[1].enabled)}/>
                <UploaderMainUploaderPathSelector
                    title="Local Directory Path (Working Directory)"
                    placeholder="Disk / Directory Path / ...more"
                    text={uploaderUploaderSettings[1].localPath.path}
                    status={uploaderUploaderSettings[1].localPath.status}
                    inputFieldId="main-uploader-pathSelector-localPath"
                    inputUpdateCallback={(value) => updateUploaderSettings("localPath", {path: value, status: "await"})}/>
                <UploaderMainUploaderPathSelector
                    title="Server Directory Path (Upload Directory)"
                    placeholder="ServerName / DirectoryPath / ...more"
                    text={uploaderUploaderSettings[1].serverPath.path}
                    status={uploaderUploaderSettings[1].serverPath.status}
                    inputFieldId="main-uploader-pathSelector-serverPath"
                    inputUpdateCallback={(value) => updateUploaderSettings("serverPath", {path: value, status: "await"})}/>
                <UploaderMainUploaderCommands
                    title="Upload Commands"
                    placeholder="Command Field"
                    uploaderUploaderSettings={uploaderUploaderSettings}
                    //updateUploaderCommands={updateUploaderCommands}
                    updateCallBack={(commands) => updateUploaderSettings("commands", commands)}/>
                <div className="main-uploader-description"
                    style={{
                        backgroundColor: uploaderTheme.uploader.description.background,
                        color: uploaderTheme.uploader.description.foreground
                    }}
                >
                    <p>File Uploader automatically observe file</p>
                    <p>changes and upload them to CubedCraft File</p>
                    <p>Manager when changes are applied.</p>
                </div>
            </div>
            <div className="main-uploader-report" style={{backgroundColor: uploaderTheme.uploader.panel.background}}>
                <UploaderMainUploaderReport
                    uploaderUploaderData={uploaderUploaderData}/>
            </div>
        </div>
    );

}

export default UploaderMainUploader;
