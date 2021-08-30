const uploaderTheme = require("../../../../templates/theme.json");

function UploaderMainEditorLineText({text}) {

    //const textFormattedRaw = text.split("\t").forEach((plainText) => ((<p>{plainText}</p>)));
    //const textFormatted = textFormattedRaw.join(<div className="main-editor-line-text-spacing"></div>);

    return (
        <div className="main-editor-line-text"
            style={{
                backgroundColor: uploaderTheme.editor.content.idle.background,
                color: uploaderTheme.editor.content.idle.foreground
            }}
        >
            <pre>{text}</pre>
        </div>
    );

}

export default UploaderMainEditorLineText;
