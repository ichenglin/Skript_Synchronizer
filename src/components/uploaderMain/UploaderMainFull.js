const {default: UploaderMainUploader} = require("./uploaderMainUploader/UploaderMainUploader");
const {default: UploaderMainHeader} = require("./UploaderMainHeader");
const {default: UploaderMainEditor} = require("./uploaderMainEditor/UploaderMainEditor");
const {default: UploaderIncomplete} = require("../uploaderIncomplete/UploaderIncomplete");
const contentPathParameters = require("../../modules/contentPathParameters");

function UploaderMainFull({sidebarPrimarySelection, uploaderEditorFile, uploaderUploaderSettings, uploaderUploaderData, uploaderStatus, updateUploaderSettings, uploaderLoginCertificate}) {

    let uploaderMainHeaderDisplay, uploaderMainContent;

    if (sidebarPrimarySelection.id === "file-explorer") {

        uploaderMainContent = (
            <UploaderMainEditor
                uploaderEditorFile={uploaderEditorFile}
                uploaderLoginCertificate={uploaderLoginCertificate}/>
        );

        if (uploaderEditorFile[1].fileData.path) {
            const uploaderEditorFilePathParameters = contentPathParameters(uploaderEditorFile[1].fileData.path);
            uploaderMainHeaderDisplay = [
                uploaderEditorFile[1].serverData.name + " / " + uploaderEditorFilePathParameters.slice(1, uploaderEditorFilePathParameters.length).join(" / "),
                " (" + uploaderEditorFile[1].fileData.size + ")"
                ].join("");
        } else {
            uploaderMainHeaderDisplay = "No File Selected";
        }

    } else if (sidebarPrimarySelection.id === "file-uploader") {

        uploaderMainContent = (
            <UploaderMainUploader
                    uploaderUploaderSettings={uploaderUploaderSettings}
                    updateUploaderSettings={updateUploaderSettings}
                    uploaderUploaderData={uploaderUploaderData}
                    uploaderStatus={uploaderStatus}/>
        );

    } else {

        uploaderMainContent = (
            <UploaderIncomplete/>
        );

    }

    return (
        <div className="main">
            <UploaderMainHeader
                text={uploaderMainHeaderDisplay}/>
            {uploaderMainContent}
        </div>
    );

}

export default UploaderMainFull;
