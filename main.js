const SPRITE = "https://dev-02.oli.cmu.edu/repository/presentation/whirlwind-1.4/web/images/asSprite.png";

const feedback = (div, correct) => {
    if (!div) return $("<div/>");

    const container = $("<div/>").css({
        display: "inline-block",
        "padding-left": "25px"
    }).append(div);

    // Colors: true, false, or "warn"
    const colors =
        correct === true ? ["#ddffdd", "#33aa33"] :
        correct === false ? ["#f4c4c9", "#e75d36"] :
        correct === "warn" ? ["#f2f497", "ffa100"] :
        [ "#ffffff", "#000000" ];

    return $("<div/>").css({
        "border-radius": "10px",
        border: "solid 2px",
        padding: "4px 7px 4px 7px",
        display: "inline-block",
        background: colors[0],
        borderColor: colors[1],
        display: "block"
    }).append(
        $("<p/>").css({"font-weight": "bold"}).text("Feedback")
    ).append(
        container
    );
}

const readHint = jquery => {
    const display = jquery.find("#display");
    const index = parseInt(display.attr("numero"));
    const visible = display.css("display") === "block";

    return { numero: index, vis: visible }
}

const initHint = {
    numero: 0,
    vis: false
}

const hint = (hints, initialState) => {
    if (!hints) {
        return $("<div/>").addClass("hintHat");
    }

    // The "display" div will contain the visual presentation of the hint, and always appears immediately
    // underneath the speech-bubble hint "hat".
    const display = $("<div/>", {
        id: "display",
        vis: initialState ? initialState.vis : "false",
        numero: initialState ? initialState.numero : "0"
    }).css({
        background: "#fde9a2",
        "border-color": "#73716e",
        overflow: "hidden",
        "min-height": "32px",
        padding: "4px 7px 4px 7px",
        "margin-top": "5px",
        width: "97%",
        position: "relative",
        "line-height": "1.4em",
        border: "solid 2px",
        "box-shadow": "1px 1px 1px rgba(0, 0, 0, 0.35)",
        "text-shadow": "0px -1px 2px #dfdfdf"
    });

    // The re-render method only manipulates the "display" object.
    const renderDisplay = () => {
        const visible = $(display).attr("vis") === "true";
        const index = parseInt($(display).attr("numero"));

        $(display).css({
            display: visible ? "block" : "none"
        });

        $(display).find("#content").html(hints[index]);

        $(display).find("#left").css({
            display: index === 0 ? "none" : "block"
        });

        $(display).find("#right").css({
            display: index === hints.length - 1 ? "none" : "block"
        });
    };

    display.append($("<div/>", {
        id: "xBtn"
    }).css({
        position: "absolute",
        top: 0,
        right: 0,
        margin: "5px",
        padding: 0,
        height: "8px",
        width: "8px",
        display: "block",
        overflow: "hidden",
        "text-indent": "-9999px",
        cursor: "pointer",
        background: `url(${SPRITE}) no repeat 0px 0px`
    }).text("x").click(() => {
        $(display).attr("vis", "false");
        renderDisplay();
    }));

    display.append($("<div/>", {
        id: "left"
    }).css({
        position: "absolute",
        top: "31%",
        left: "15px",
        background: `url(${SPRITE}) no-repeat -8px -14px`,
        "text-indent": "-9999px",
        height: "15px",
        width: "10px",
    }).text("left").click(() => {
        const index = parseInt($(display).attr("numero"));
        $(display).attr("numero", index - 1);
        renderDisplay();
    }));

    display.append($("<div/>", {
        id: "right"
    }).css({
        position: "absolute",
        top: "31%",
        right: "15px",
        background: `url(${SPRITE}) no-repeat -8px 0px`,
        "text-indent": "-9999px",
        height: "15px",
        width: "10px",
    }).text("right").click(() => {
        const index = parseInt($(display).attr("numero"));
        $(display).attr("numero", index + 1);
        renderDisplay();
    }));

    display.append($("<div/>", {
        id: "content"
    }).css({
        "float": "left",
        padding: "0px 35px",
    }));

    // The display's hat is static, and changes the visibilty of the display itself
    const hat = $("<div/>", {id: "hat"}).css({
        cursor: "pointer",
        display: "inline-block",
        "text-decoration": "none",
        overflow: "hidden",
        "text-indent": "-9999px",
        width: "30px",
        height: "17px",
        margin: "0px 0px 0px 6px",
        background: `url("${SPRITE}") no-repeat -46px -19px`
    }).click(() => {
        const vis = $(display).attr("vis") === "true";
        $(display).attr("vis", !vis);
        renderDisplay();
    }).text("hint");

    // Initially set up the display's state
    renderDisplay();

    return $("<div/>").append(hat).append(display);
}

module.exports = {
    feedback: feedback,
    readHint: readHint,
    initHint: initHint,
    hint: hint
}
