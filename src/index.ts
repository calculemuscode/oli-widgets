import { FeedbackData } from "@calculemus/oli-hammock";

/**
 * If the page is being visited by HTTPS, assume that we're on an OLI server, and serve the hint sprites from the same server. Otherwise, assume we're testing on a client and serve the dev-02 version of the sprite.
 */
const SPRITE =
    document.location.protocol === "https"
        ? "/repository/presentation/whirlwind-1.4/web/images/asSprite.png"
        : "https://dev-02.oli.cmu.edu/repository/presentation/whirlwind-1.4/web/images/asSprite.png";

/**
 * Display feedback from the Hammock's feedback data object
 */
export function feedback(data?: FeedbackData): HTMLElement {
    if (!data) return $("<div/>").get(0);

    const container = $("<div/>")
        .css({
            display: "inline-block",
            "padding-left": "25px"
        })
        .append(data.message);

    // Colors: true, false, and "info"
    const colors =
        data.correct === true
            ? ["#ddffdd", "#33aa33"]
            : data.correct === false
                ? ["#f4c4c9", "#e75d36"]
                : data.correct === "info"
                    ? ["#f2f497", "ffa100"]
                    : ["#ffffff", "#000000"];

    return $("<div/>")
        .css({
            "border-radius": "10px",
            border: "solid 2px",
            padding: "4px 7px 4px 7px",
            display: "inline-block",
            background: colors[0],
            borderColor: colors[1]
        })
        .append(
            $("<p/>")
                .css({ "font-weight": "bold" })
                .text("Feedback")
        )
        .append(container).get(0);
}

/**
 * HintData should be treated as an abstract type and should NOT be directly read by any
 * clients. It is not a stable part of the interface.
 */
export type HintData = {
    numero: number;
    vis: boolean;
};

/**
 * readHint takes a JQuery element containing a hint and extracts the hint state.
 */
export function readHint(jquery: JQuery<HTMLElement>) {
    const display = jquery.find("#hint_display");
    const numero = display.attr("numero");
    if (numero === undefined) {
        console.error("readHint method called on a non-hint object:");
        console.error(display);
        throw new Error("invalid input for readHint()");
    }

    return { numero: parseInt(numero), vis: display.css("display") === "x" };
}

/**
 * Default hint state: creates a clickable hint textbox but no displayed hint.
 */
export const emptyHint: HintData = {
    numero: 0,
    vis: false
};

/**
 * Render a hint.
 *
 * @param hints List of hints
 * @param state Current hint state (should be {@link emptyHint} or a {@link HintData} returned from reading the hint state previously with {@link readHint}. Do not construct or modify {@link HintData} objects.)
 */
export function hint(hints: string[] | undefined, state: HintData): HTMLElement {
    if (hints === undefined) {
        console.error("hint() widget called without hints");
        return $("<div/>").get(0);
    }

    // The "display" div will contain the visual presentation of the hint, and always appears immediately
    // underneath the speech-bubble hint "hat".
    const display = $("<div/>", {
        id: "display",
        vis: state ? state.vis : "false",
        numero: state ? state.numero : "0"
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
        const index = parseInt($(display).attr("numero") || "0");

        $(display).css({
            display: visible ? "block" : "none"
        });

        $(display)
            .find("#content")
            .html(hints[index]);

        $(display)
            .find("#left")
            .css({
                display: index === 0 ? "none" : "block"
            });

        $(display)
            .find("#right")
            .css({
                display: index === hints.length - 1 ? "none" : "block"
            });
    };

    display.append(
        $("<div/>", {
            id: "xBtn"
        })
            .css({
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
            })
            .text("x")
            .click(() => {
                $(display).attr("vis", "false");
                renderDisplay();
            })
    );

    display.append(
        $("<div/>", {
            id: "left"
        })
            .css({
                position: "absolute",
                top: "31%",
                left: "15px",
                background: `url(${SPRITE}) no-repeat -8px -14px`,
                "text-indent": "-9999px",
                height: "15px",
                width: "10px"
            })
            .text("left")
            .click(() => {
                const index = parseInt($(display).attr("numero") || "0");
                $(display).attr("numero", index - 1);
                renderDisplay();
            })
    );

    display.append(
        $("<div/>", {
            id: "right"
        })
            .css({
                position: "absolute",
                top: "31%",
                right: "15px",
                background: `url(${SPRITE}) no-repeat -8px 0px`,
                "text-indent": "-9999px",
                height: "15px",
                width: "10px"
            })
            .text("right")
            .click(() => {
                const index = parseInt($(display).attr("numero") || "0");
                $(display).attr("numero", index + 1);
                renderDisplay();
            })
    );

    display.append(
        $("<div/>", {
            id: "content"
        }).css({
            float: "left",
            padding: "0px 35px"
        })
    );

    // The display's hat is static, and changes the visibilty of the display itself
    const hat = $("<div/>", { id: "hat" })
        .css({
            cursor: "pointer",
            display: "inline-block",
            "text-decoration": "none",
            overflow: "hidden",
            "text-indent": "-9999px",
            width: "30px",
            height: "17px",
            margin: "0px 0px 0px 6px",
            background: `url("${SPRITE}") no-repeat -46px -19px`
        })
        .click(() => {
            const vis = $(display).attr("vis") === "true";
            $(display).attr("vis", `${!vis}`);
            renderDisplay();
        })
        .text("hint");

    // Initially set up the display's state
    renderDisplay();

    return $("<div/>")
        .append(hat)
        .append(display)
        .get(0);
}
