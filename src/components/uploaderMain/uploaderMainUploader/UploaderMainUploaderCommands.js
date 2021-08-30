const randomString = require("../../../modules/randomString");
const uploaderTheme = require("../../../templates/theme.json");

function UploaderMainUploaderCommands({title, placeholder, uploaderUploaderSettings, updateCallBack}) {

    // Text Field Commands
    let uploaderCommandsRaw = {
        lastUpdateTime: Date.now(),
        lastUpdateCommands: uploaderUploaderSettings[1].commands
    };

    function editUploaderCommand(commandIndex, newCommand) {
        uploaderCommandsRaw.lastUpdateCommands[commandIndex].command = newCommand;
        updateCallbackAfterEditingComplete(1000);
    }

    function addUploaderCommand() {
        const newCommandId = randomString(8, uploaderCommandsRaw.lastUpdateCommands.map((element) => element.id));
        uploaderCommandsRaw.lastUpdateCommands.push({id: newCommandId, command: ""});
        updateCallbackAfterEditingComplete(0);
    }

    function removeUploaderCommand(commandIndex) {
        uploaderCommandsRaw.lastUpdateCommands = uploaderCommandsRaw.lastUpdateCommands.filter((command, index) => index !== commandIndex);
        updateCallbackAfterEditingComplete(0);
    }

    function updateCallbackAfterEditingComplete(editingTimeout) {
        const newUpdateTime = Date.now();
        uploaderCommandsRaw.lastUpdateTime = newUpdateTime;
        setTimeout(() => {
            if (uploaderCommandsRaw.lastUpdateTime === newUpdateTime) {
                updateCallBack(uploaderCommandsRaw.lastUpdateCommands);
            }
        }, editingTimeout);
    }

    return (
        <div className="main-uploader-commands" style={{backgroundColor: uploaderTheme.uploader.commands.container.background}}>
            <div className="main-uploader-commands-title" style={{color: uploaderTheme.uploader.commands.container.foreground}}>
                <p>{title}</p>
            </div>
            <div className="main-uploader-commands-content">
                {uploaderCommandsRaw.lastUpdateCommands.map((element, index) => (
                    <div
                        className="main-uploader-commands-content-added"
                        key={element.id}
                        style={{backgroundColor: uploaderTheme.uploader.commands["input-field"].background}}
                    >
                        <input type="text"
                            placeholder={placeholder}
                            defaultValue={element.command}
                            onChange={(event) => editUploaderCommand(index, event.target.value)}
                            spellCheck="false"
                            style={{color: uploaderTheme.uploader.commands["input-field"].foreground}}/>
                        <div className="main-uploader-commands-content-added-delete"
                            onClick={() => removeUploaderCommand(index)}
                            style={{
                                backgroundColor: uploaderTheme.uploader.commands["input-remove"].background,
                                color: uploaderTheme.uploader.commands["input-remove"].foreground
                            }}
                        >
                            <i className="far fa-trash-alt"></i>
                        </div>
                    </div>
                ))}
                {uploaderCommandsRaw.lastUpdateCommands.length < 10 &&
                    <div className="main-uploader-commands-content-new"
                        onClick={() => addUploaderCommand()}
                        style={{
                            backgroundColor: uploaderTheme.uploader.commands["input-new"].background,
                            color: uploaderTheme.uploader.commands["input-new"].foreground
                        }}
                    >
                        <i className="fas fa-plus"></i>
                        <p>Add New Command</p>
                    </div>
                }
            </div>
        </div>
    );

}

export default UploaderMainUploaderCommands;
