const {default: UploaderMainEditorLine} = require("./uploaderMainEditorLine/UploaderMainEditorLine");
const captionTemplate = require("../../../templates/caption.json");
const uploaderTheme = require("../../../templates/theme.json");

function UploaderMainEditor({uploaderEditorFile, uploaderLoginCertificate}) {

    document.documentElement.style.setProperty("--mainEditorScrollbarColor", uploaderTheme.editor.scrollbar.foreground);

    let uploaderEditorFileContent;

    if (uploaderEditorFile[1].fileData.path) {
        uploaderEditorFileContent = uploaderEditorFile[1].fileContent;
    } else {
        uploaderEditorFileContent = [
            "",
            "",
            ...captionTemplate[1],
            "",
            "",
            "Welcome " + (uploaderLoginCertificate.success === true ? uploaderLoginCertificate.profile.username : "Guest") + ",",
            "Click On A File In File Explorer",
            "To Have Its Content Displayed Here.",
            ""
        ];
    }

    return (
        <div className="main-editor" style={{backgroundColor: uploaderTheme.editor.content.idle.background}}>
            {uploaderEditorFileContent.map((element, index) => (
                <UploaderMainEditorLine key={index} index={(index + 1)} text={element}/>
            ))}
        </div>
    );

}

export default UploaderMainEditor;