const uploaderTheme = require("../../../templates/theme.json");

function UploaderSidebarProfile({uploaderLoginCertificate, uploaderEnvironment}) {

    const sidebarProfileAccount = {

        valid: uploaderLoginCertificate.success,
        avatar_url: (uploaderLoginCertificate.success ? "https://cravatar.eu/helmavatar/" + uploaderLoginCertificate.profile.uuid + "/64.png" : "https://cubedcraft.com/uploads/server-icon.png"),
        username: (uploaderLoginCertificate.success ? uploaderLoginCertificate.profile.username : "Logged Out"),
        
    }

    const sidebarProfileDisplay = [
        {
            index: 0,
            title: "UUID",
            content: (uploaderLoginCertificate.success ? uploaderLoginCertificate.profile.uuid : "(Logged Out)")
        },
        {
            index: 1,
            title: "Session",
            content: (uploaderLoginCertificate.success ? uploaderLoginCertificate.session.slice(0, 6).toUpperCase() + " *".repeat(uploaderLoginCertificate.session.length - 6) : "(Logged Out)")
        },
        {
            index: 2,
            title: "Product",
            content: uploaderEnvironment[3]
        }
    ];

    return (
        <div className="sidebar-profile" style={{backgroundColor: uploaderTheme.sidebar.profile.background, color: uploaderTheme.sidebar.profile.content}}>
            <div className="sidebar-profile-header" style={{backgroundColor: uploaderTheme.sidebar.profile.foreground, borderColor: uploaderTheme.sidebar.profile.border}}>
                <img src={sidebarProfileAccount.avatar_url} alt={sidebarProfileAccount.username} />
                <p>{sidebarProfileAccount.username}</p>
            </div>
            <div className="sidebar-profile-spacing"></div>
            <div className="sidebar-profile-details">
                {sidebarProfileDisplay.map((loopSidebarProfileDisplay) => (
                    <div key={loopSidebarProfileDisplay.index} className="sidebar-profile-details-content">
                        <p className="sidebar-profile-details-content-title">{loopSidebarProfileDisplay.title}</p>
                        <p>{loopSidebarProfileDisplay.content}</p>
                    </div>
                ))}
            </div>
            <div className="sidebar-profile-spacing"></div>
            <div className="sidebar-profile-information">
                <p>(CubedCraft File Uploader)</p>
            </div>
        </div>
    );

}

export default UploaderSidebarProfile;
