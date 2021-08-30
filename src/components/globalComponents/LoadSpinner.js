function LoadSpinner({size, width, cycle, foregroundColor, backgroundColor}) {

    return (
        <div className="global-loadspinner"
            style={{
                width: size + "px",
                height: size + "px",
                border: width + "px solid " + backgroundColor,
                borderTop: width + "px solid " + foregroundColor,
                animation: "global-loadspinner-animation " + cycle + "s linear infinite"
            }}
        ></div>
    );

}

export default LoadSpinner;
