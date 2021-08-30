const {default: LoadSpinner} = require("../globalComponents/LoadSpinner");
const {default: LoadText} = require("../globalComponents/LoadText");
const uploaderTheme = require("../../templates/theme.json");

function UploaderLogin({uploaderLoginCertificate, requestLoginWithCredentials}) {

    document.documentElement.style.setProperty("--loginCredentialsFieldForeground", uploaderTheme.login.field.foreground);
    document.documentElement.style.setProperty("--loginCredentialsFieldBackground", uploaderTheme.login.field.background);
    document.documentElement.style.setProperty("--loginCredentialsFieldPlaceholder", uploaderTheme.login.field.placeholder);

    document.documentElement.style.setProperty("--loginSubmissionButtonForeground", uploaderTheme.login.submission.foreground);
    document.documentElement.style.setProperty("--loginSubmissionButtonBackground", uploaderTheme.login.submission.background);

    const loginTextFields = [
        {
            name: "Username",
            type: "text",
            id: "login-username"
        },
        {
            name: "Password",
            type: "password",
            id: "login-password"
        }
    ];

    function loginFormSubmit(event) {

        event.preventDefault();

        const loginCredentialsUsername = document.getElementById("login-username").value;
        const loginCredentialsPassword = document.getElementById("login-password").value;
        const loginCredentialsSaveAsEncrypted = document.getElementById("save-encrypted").checked;

        if (!loginCredentialsUsername || !loginCredentialsPassword) {
            return;
        }

        requestLoginWithCredentials(loginCredentialsUsername, loginCredentialsPassword, loginCredentialsSaveAsEncrypted);

    }

    return (
        <div className="login">
            <div className="login-main" style={{backgroundColor: uploaderTheme.login.form.background}}>
                <div className="login-header" style={{backgroundColor: uploaderTheme.login.header.background, color: uploaderTheme.login.header.foreground}}>
                    <p>Login To CubedCraft</p>
                </div>
                {uploaderLoginCertificate.validating === true ? (
                    <div className="login-loader">
                        <LoadSpinner size="100" width="12" cycle="1" foregroundColor={uploaderTheme.login.loader.foreground} backgroundColor={uploaderTheme.login.loader.background}/>
                        <div className="login-loader-text" style={{color: uploaderTheme.login.loader.text}}>
                            <p>Validating Login Credentials</p>
                            <LoadText spacing="3" cycle="5"/>
                        </div>
                    </div>
                ) : (
                    <div className="login-form" style={{backgroundColor: uploaderTheme.login.form.background, color: uploaderTheme.login.form.foreground}}>
                        <form onSubmit={loginFormSubmit}>
                            {loginTextFields.map((element, index) => (
                                <div className="login-field" key={index}>
                                    <div className="login-field-title">
                                        <p>{element.name + ":"}</p>
                                    </div>
                                    <div className="login-field-input">
                                        <input type={element.type} id={element.id} placeholder={element.name} spellCheck="false"/>
                                    </div>
                                </div>
                            ))}
                            <div className="login-form-spacing"></div>
                            <div className="login-field login-action">
                                <div className="login-submit">
                                    <input type="submit" value="Login"/>
                                </div>
                                <div className="login-encrypt">
                                    <input type="checkbox" id="save-encrypted" defaultChecked="true"/>
                                    <p>Encrypt Login Credentials</p>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UploaderLogin;
