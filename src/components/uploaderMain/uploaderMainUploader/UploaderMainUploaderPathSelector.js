const uploaderTheme = require("../../../templates/theme.json");

function UploaderMainUploaderPathSelector({title, placeholder, text, status, inputFieldId, inputUpdateCallback}) {

    document.documentElement.style.setProperty("--mainUploaderPathSelectorFieldColor", uploaderTheme.uploader["path-selector"]["input-field"].foreground);

    let inputChange = {lastUpdateValue: "", lastUpdateTime: Date.now()};
    const statusDisplay = {
        verified: "Verified",
        await: "Await",
        error: "Error"
    }

    function pathSelectorInputChange(newValue) {

        const currentUpdateTime = Date.now();
        inputChange = {lastUpdateValue: newValue, lastUpdateTime: currentUpdateTime};

        setTimeout(() => {
            if (inputChange.lastUpdateTime === currentUpdateTime) {
                inputUpdateCallback(inputChange.lastUpdateValue);
            }
        }, 1000);

    }

    return (
        <div className="main-uploader-pathSelector" style={{backgroundColor: uploaderTheme.uploader["path-selector"].container.background}}>
            <div className="main-uploader-pathSelector-title" style={{color: uploaderTheme.uploader["path-selector"].container.foreground}}>
                <p>{title}</p>
            </div>
            <div className="main-uploader-pathSelector-input">
                <div className="main-uploader-pathSelector-input-field" style={{backgroundColor: uploaderTheme.uploader["path-selector"]["input-field"].background}}>
                    <input
                        type="text"
                        placeholder={placeholder}
                        defaultValue={text}
                        id={inputFieldId}
                        onChange={(event) => pathSelectorInputChange(event.target.value)} spellCheck="false"/>
                </div>
                <div className="main-uploader-pathSelector-input-status" style={{backgroundColor: uploaderTheme.uploader["path-selector"]["input-status"][status].background}}>
                    <p style={{color: uploaderTheme.uploader["path-selector"]["input-status"][status].foreground}}>{statusDisplay[status]}</p>
                </div>
            </div>
        </div>
    );

}

export default UploaderMainUploaderPathSelector;
