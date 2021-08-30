const uploaderTheme = require("../../../../templates/theme.json");

function UploaderMainEditorLineIndex({index}) {

    return (
        <div className="main-editor-line-index"
            style={{
                color: uploaderTheme.editor.index.idle.foreground,
                backgroundColor: uploaderTheme.editor.index.idle.background
            }}
        >
            {index}
        </div>
    );

}

export default UploaderMainEditorLineIndex;
