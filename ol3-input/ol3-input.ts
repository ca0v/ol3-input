// http://www.w3schools.com/charsets/ref_utf_arrows.asp

import $ = require("jquery");
import ol = require("openlayers");

export function cssin(name: string, css: string) {
    let id = `style-${name}`;
    let styleTag = <HTMLStyleElement>document.getElementById(id);
    if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = id;
        styleTag.innerText = css;
        document.head.appendChild(styleTag);
    }

    let dataset = styleTag.dataset;
    dataset["count"] = parseInt(dataset["count"] || "0") + 1 + "";

    return () => {
        dataset["count"] = parseInt(dataset["count"] || "0") - 1 + "";
        if (dataset["count"] === "0") {
            styleTag.remove();
        }
    };
}

export function mixin<A extends any, B extends any>(a: A, b: B) {
    Object.keys(b).forEach(k => a[k] = b[k]);
    return <A & B>a;
}

const css = `
    .ol-input {
        position:absolute;
    }
    .ol-input.top {
        top: 0.5em;
    }
    .ol-input.top-1 {
        top: 1.5em;
    }
    .ol-input.top-2 {
        top: 2.5em;
    }
    .ol-input.top-3 {
        top: 3.5em;
    }
    .ol-input.top-4 {
        top: 4.5em;
    }
    .ol-input.left {
        left: 0.5em;
    }
    .ol-input.left-1 {
        left: 1.5em;
    }
    .ol-input.left-2 {
        left: 2.5em;
    }
    .ol-input.left-3 {
        left: 3.5em;
    }
    .ol-input.left-4 {
        left: 4.5em;
    }
    .ol-input.bottom {
        bottom: 0.5em;
    }
    .ol-input.bottom-1 {
        bottom: 1.5em;
    }
    .ol-input.bottom-2 {
        bottom: 2.5em;
    }
    .ol-input.bottom-3 {
        bottom: 3.5em;
    }
    .ol-input.bottom-4 {
        bottom: 4.5em;
    }
    .ol-input.right {
        right: 0.5em;
    }
    .ol-input.right-1 {
        right: 1.5em;
    }
    .ol-input.right-2 {
        right: 2.5em;
    }
    .ol-input.right-3 {
        right: 3.5em;
    }
    .ol-input.right-4 {
        right: 4.5em;
    }
    .ol-input button {
        min-height: 1.375em;
        min-width: 1.375em;
        width: auto;
        display: inline;
    }
    .ol-input.left button {
        float:right;
    }
    .ol-input.right button {
        float:left;
    }
    .ol-input input {
        height: 2.175em;
        width: 16em;
        border: none;
        padding: 0;
        margin: 0;
        margin-left: 2px;
        margin-top: 2px;
        vertical-align: top;
    }
    .ol-input input.ol-hidden {
        width: 0;
        margin: 0;
    }
`;

let olcss = {
    CLASS_CONTROL: 'ol-control',
    CLASS_UNSELECTABLE: 'ol-unselectable',
    CLASS_UNSUPPORTED: 'ol-unsupported',
    CLASS_HIDDEN: 'ol-hidden'
};

export interface IOptions {
    // what css class name to assign to the main element
    className?: string;
    expanded?: boolean;
    hideButton?: boolean;
    autoClear?: boolean;
    autoCollapse?: boolean;
    autoSelect?: boolean;
    canCollapse?: boolean;
    closedText?: string;
    openedText?: string;
    source?: HTMLElement;
    target?: HTMLElement;
    // what to show on the tooltip
    placeholderText?: string;
    onChange?: (args: { value: string }) => void;
}

const expando = {
    right: '»',
    left: '«'
};

const defaults: IOptions = {
    className: 'ol-input bottom left',
    expanded: false,
    autoClear: false,
    autoCollapse: true,
    autoSelect: true,
    canCollapse: true,
    hideButton: false,
    closedText: expando.right,
    openedText: expando.left,
    placeholderText: 'Search'
};

export class Input extends ol.control.Control {

    static create(options?: IOptions): Input {

        cssin('ol-input', css);

        // provide computed defaults        
        options = mixin({
            openedText: options.className && -1 < options.className.indexOf("left") ? expando.left : expando.right,
            closedText: options.className && -1 < options.className.indexOf("left") ? expando.right : expando.left,
        }, options || {});

        // provide static defaults        
        options = mixin(mixin({}, defaults), options);

        let element = document.createElement('div');
        element.className = `${options.className} ${olcss.CLASS_UNSELECTABLE} ${olcss.CLASS_CONTROL}`;

        let geocoderOptions = mixin({
            element: element,
            target: options.target,
            expanded: false
        }, options);

        return new Input(geocoderOptions);
    }

    private button: HTMLButtonElement;
    private input: HTMLInputElement;

    constructor(options: IOptions & {
        element: HTMLElement;
        target: HTMLElement;
    }) {

        if (options.hideButton) {
            options.canCollapse = false;
            options.autoCollapse = false;
            options.expanded = true;
        }

        super({
            element: options.element,
            target: options.target
        });

        let button = this.button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.title = options.placeholderText;
        options.element.appendChild(button);
        if (options.hideButton) {
            button.style.display = "none";
        }

        let input = this.input = document.createElement('input');
        input.placeholder = options.placeholderText;

        options.element.appendChild(input);

        button.addEventListener("click", () => {
            options.expanded ? this.collapse(options) : this.expand(options);
        });

        input.addEventListener("keypress", (args: KeyboardEvent) => {
            if (args.key === "Enter") {
                button.focus();
                options.autoCollapse && this.collapse(options);
            }
        });

        input.addEventListener("change", () => {
            let args = {
                type: "change",
                value: input.value
            };

            if (options.autoSelect) {
                input.select();
            }

            if (options.autoClear) {
                input.value = "";
            }

            this.dispatchEvent(args);
            if (options.onChange) options.onChange(args);
        });

        input.addEventListener("blur", () => {
            //this.collapse(options);
        });

        options.expanded ? this.expand(options) : this.collapse(options);
    }

    collapse(options: IOptions) {
        if (!options.canCollapse) return;
        options.expanded = false;
        this.input.classList.toggle(olcss.CLASS_HIDDEN, true);
        this.button.classList.toggle(olcss.CLASS_HIDDEN, false);
        this.button.innerHTML = options.closedText;
    }

    expand(options: IOptions) {
        options.expanded = true;
        this.input.classList.toggle(olcss.CLASS_HIDDEN, false);
        this.button.classList.toggle(olcss.CLASS_HIDDEN, true);
        this.button.innerHTML = options.openedText;
        this.input.focus();
        this.input.select();
    }

    on(type: string, cb: Function);
    on(type: "change", cb: (args: {
        type: string;
        target: Input;
        value: string;
    }) => void);
    on(type: string, cb: Function) {
        super.on(type, cb);
    }
}