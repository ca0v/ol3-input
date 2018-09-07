import { should, shouldEqual } from "../base";
import { describe, it } from "mocha";
import { InputOptions, Input, OsmSearchProvider } from "../../index";

describe("Input Tests", () => {
    it("Input", () => {
        should(!!Input, "Input");
    });

    it("OsmSearchProvider", () => {
        // to become part of an API test, but really belongs in ol3-search providers
        should(!!OsmSearchProvider, "OsmSearchProvider");
    });

    it("DEFAULT_OPTIONS", () => {
        let options = Input.DEFAULT_OPTIONS;
        checkDefaultInputOptions(options);
    });

    it("options of an Input instance", () => {
        let input = Input.create();
        checkDefaultInputOptions(input.options);
    });

    it("input dom", (done) => {
        let input = Input.create({});
        let target = document.createElement("div");
        input.on("change", (args: { value: string }) => {
            should(args.value === "hello", "change to hello");
            done();
        });
        shouldEqual(target.innerHTML, "", "innerHTML");
        input.setValue("hello");
    });
});

function checkDefaultInputOptions(options: InputOptions) {
    should(!!options, "options");
    shouldEqual(options.autoChange, false, "autoChange");
    shouldEqual(options.autoClear, false, "autoClear");
    shouldEqual(options.autoCollapse, true, "autoCollapse");
    shouldEqual(options.autoSelect, true, "autoSelect");
    shouldEqual(options.canCollapse, true, "canCollapse");
    shouldEqual(options.changeDelay, 2000, "changeDelay");
    shouldEqual(options.className, "ol-input", "className");
    should(options.closedText.length > 0, "closedText");
    shouldEqual(options.expanded, false, "expanded");
    shouldEqual(options.hideButton, false, "hideButton");
    shouldEqual(options.map, undefined, "map");
    shouldEqual(!!options.openedText, true, "openedText");
    shouldEqual(!!options.placeholderText, true, "placeholderText");
    shouldEqual(options.position, "bottom left", "position");
    shouldEqual(!!options.provider, true, "provider");
    should(!!options.regex, "regex");
    shouldEqual(options.render, undefined, "render");
    shouldEqual(options.source, undefined, "source");
    shouldEqual(options.target, undefined, "target");
}
