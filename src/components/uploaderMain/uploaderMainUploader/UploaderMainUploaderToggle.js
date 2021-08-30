const uploaderTheme = require("../../../templates/theme.json");
const { default: LoadText } = require("../../globalComponents/LoadText");

function UploaderMainUploaderToggle({title, value, toggleCallBack}) {

    //let toggleStatus;
    //const toggleStatus = (value === true ? {id: "enabled", display: "Enabled"} : {id: "disabled", display: "Disabled"});
    const statusDisplay = {
        enabled: (
            <>
                <p>Enabled</p>
            </>
        ),
        disabled: (
            <>
                <p>Disabled</p>
            </>
        ),
        initializing: (
            <>
                <p>Initializing</p>
                <LoadText spacing="2"/>
            </>
        )
    }

    return (
        <div className="main-uploader-toggle" style={{backgroundColor: uploaderTheme.uploader.toggle.container.background}}>
            <div className="main-uploader-toggle-title" style={{color: uploaderTheme.uploader.toggle.container.foreground}}>
                <p>{title}</p>
            </div>
            <div className="main-uploader-toggle-button"
                onClick={toggleCallBack}
                style={{
                    backgroundColor: uploaderTheme.uploader.toggle.button[value].background,
                    color: uploaderTheme.uploader.toggle.button[value].foreground
                }}
            >
                {statusDisplay[value]}
            </div>
        </div>
    );

}

export default UploaderMainUploaderToggle;
