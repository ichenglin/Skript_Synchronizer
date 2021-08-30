const uploaderTheme = require("../../templates/theme.json");

function UploaderIncomplete() {

    return (
        <div className="incomplete" style={{backgroundColor: uploaderTheme.incomplete.background, color: uploaderTheme.incomplete.foreground}}>
            <div className="incomplete-title">
                <p>Ooopsie!</p>
            </div>
            <div className="incomplete-context">
                <p>This feature is currently</p>
                <p>under development. ;(</p>
            </div>
        </div>
    );

}

export default UploaderIncomplete;
