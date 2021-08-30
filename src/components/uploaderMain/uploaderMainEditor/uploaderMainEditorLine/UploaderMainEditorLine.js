const {default: UploaderMainEditorLineIndex} = require("./UploaderMainEditorLineIndex");
const {default: UploaderMainEditorLineText} = require("./UploaderMainEditorLineText");

function UploaderMainEditorLine({index, text}) {

    return (
        <div className="main-editor-line">
            <UploaderMainEditorLineIndex index={index}/>
            <UploaderMainEditorLineText text={text}/>
        </div>
    );

}

export default UploaderMainEditorLine;
