import ol = require("openlayers");
import { olx } from "openlayers";
import { OpenStreet } from "./providers/osm";
export interface InputOptions extends olx.control.ControlOptions {
    map?: ol.Map;
    className?: string;
    position?: string;
    expanded?: boolean;
    hideButton?: boolean;
    autoChange?: boolean;
    autoClear?: boolean;
    autoCollapse?: boolean;
    autoSelect?: boolean;
    canCollapse?: boolean;
    changeDelay?: number;
    closedText?: string;
    openedText?: string;
    target?: HTMLElement;
    regex?: RegExp;
    placeholderText?: string;
    provider?: typeof OpenStreet;
    source?: ol.source.Vector;
}
export declare class Input extends ol.control.Control {
    static DEFAULT_OPTIONS: InputOptions;
    static create(options?: InputOptions): Input;
    button: HTMLButtonElement;
    input: HTMLInputElement;
    options: InputOptions;
    handlers: Array<() => void>;
    private constructor();
    destroy(): void;
    setPosition(position: string): void;
    cssin(): void;
    collapse(options: InputOptions): void;
    expand(options: InputOptions): void;
    on(type: string, cb: Function): any;
    on(type: "change", cb: (args: {
        type: string;
        target: Input;
        value: string;
    }) => void): any;
}
