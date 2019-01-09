// Type definitions for Apache Cordova InAppBrowser plugin
// Project: https://github.com/apache/cordova-plugin-inappbrowser
// Definitions by: Microsoft Open Technologies Inc <http://msopentech.com>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
//
// Copyright (c) Microsoft Open Technologies Inc
// Licensed under the MIT license.
// TypeScript Version: 2.3
type channel = "loadstart" | "loadstop" | "loaderror" | "exit" | "message";

interface Window {
    /**
     * Opens a URL in a new InAppYapster instance, the current browser instance, or the system browser.
     * @param  url     The URL to load.
     * @param  target  The target in which to load the URL, an optional parameter that defaults to _self.
     * @param  options Options for the InAppYapster. Optional, defaulting to: location=yes.
     *                 The options string must not contain any blank space, and each feature's
     *                 name/value pairs must be separated by a comma. Feature names are case insensitive.
     */
    open(url: string, target?: string, options?: string, replace?: boolean): InAppYapster;
}

/**
 * The object returned from a call to window.open.
 * NOTE: The InAppYapster window behaves like a standard web browser, and can't access Cordova APIs.
 */
interface InAppYapster extends Window {
    onloadstart(type: Event): void;
    onloadstop(type: InAppYapsterEvent): void;
    onloaderror(type: InAppYapsterEvent): void;
    onexit(type: InAppYapsterEvent): void;
    // addEventListener overloads
    /**
     * Adds a listener for an event from the InAppYapster.
     * @param type      loadstart: event fires when the InAppYapster starts to load a URL.
     *                  loadstop: event fires when the InAppYapster finishes loading a URL.
     *                  loaderror: event fires when the InAppYapster encounters an error when loading a URL.
     *                  exit: event fires when the InAppYapster window is closed.
     * @param callback  the function that executes when the event fires. The function is
     *                  passed an InAppYapsterEvent object as a parameter.
     */
    addEventListener(type: channel, callback: InAppYapsterEventListenerOrEventListenerObject): void;
    // removeEventListener overloads
    /**
     * Removes a listener for an event from the InAppYapster.
     * @param type      The event to stop listening for.
     *                  loadstart: event fires when the InAppYapster starts to load a URL.
     *                  loadstop: event fires when the InAppYapster finishes loading a URL.
     *                  loaderror: event fires when the InAppYapster encounters an error when loading a URL.
     *                  exit: event fires when the InAppYapster window is closed.
     * @param callback  the function that executes when the event fires. The function is
     *                  passed an InAppYapsterEvent object as a parameter.
     */
    removeEventListener(type: channel, callback: InAppYapsterEventListenerOrEventListenerObject): void;
    /** Closes the InAppYapster window. */
    close(): void;
    /** Hides the InAppYapster window. Calling this has no effect if the InAppYapster was already hidden. */
    hide(): void;
    /**
     * Displays an InAppYapster window that was opened hidden. Calling this has no effect
     * if the InAppYapster was already visible.
     */
    show(): void;
    /**
     * Injects JavaScript code into the InAppYapster window.
     * @param script    Details of the script to run, specifying either a file or code key.
     * @param callback  The function that executes after the JavaScript code is injected.
     *                  If the injected script is of type code, the callback executes with
     *                  a single parameter, which is the return value of the script, wrapped in an Array.
     *                  For multi-line scripts, this is the return value of the last statement,
     *                  or the last expression evaluated.
     */
    executeScript(script: { code: string } | { file: string }, callback: (result: any) => void): void;
    /**
     * Injects CSS into the InAppYapster window.
     * @param css       Details of the script to run, specifying either a file or code key.
     * @param callback  The function that executes after the CSS is injected.
     */
    insertCSS(css: { code: string } | { file: string }, callback: () => void): void;
}

type InAppYapsterEventListenerOrEventListenerObject = InAppYapsterEventListener | InAppYapsterEventListenerObject;

type InAppYapsterEventListener = (evt: InAppYapsterEvent) => void;

interface InAppYapsterEventListenerObject {
    handleEvent(evt: InAppYapsterEvent): void;
}

interface InAppYapsterEvent extends Event {
    /** the eventname, either loadstart, loadstop, loaderror, or exit. */
    type: string;
    /** the URL that was loaded. */
    url: string;
    /** the error code, only in the case of loaderror. */
    code: number;
    /** the error message, only in the case of loaderror. */
    message: string;
}

interface Cordova {
    InAppYapster: InAppYapster;
}
