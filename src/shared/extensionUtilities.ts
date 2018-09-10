import * as vscode from 'vscode';
import * as path from 'path';
import { ext } from "../shared/extensionGlobals";
import { ScriptResource } from '../lambda/models/scriptResource';
import * as _ from 'lodash';

export class ExtensionUtilities {
    public static getLibrariesForHtml(names: string[]): ScriptResource[] {
        const basePath = path.join(ext.context.extensionPath, 'media', 'libs');
        return this.resolveResourceURIs(basePath, names);
    }
    public static getScriptsForHtml(names: string[]): ScriptResource[] {
        const basePath = path.join(ext.context.extensionPath, 'media', 'js');
        return this.resolveResourceURIs(basePath, names);
    }

    private static resolveResourceURIs(basePath: string, names: string[]): ScriptResource[] {
        const scripts: ScriptResource[] = [];
        _.forEach(names, (scriptName) => {
            const scriptPathOnDisk = vscode.Uri.file(path.join(basePath, scriptName));
            const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
            const nonce = ExtensionUtilities.getNonce();
            scripts.push({ Nonce: nonce, Uri: scriptUri });
        });
        return scripts;
    }

    public static getNonce(): string {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}

/**
 * A utility function that takes a possibly null value and applies
 * the given function to it, returning the result of the function or null
 * 
 * example usage:
 * 
 * function blah(value?: SomeObject) {
 *  nullSafeGet(value, x => x.propertyOfSomeObject)
 * }
 * 
 * @param obj the object to attempt the get function on
 * @param getFn the function to use to determine the mapping value
 */
export function safeGet<O, T>(obj: O | undefined, getFn: (x: O) => T): T | undefined {
    if (obj) {
        try {
            return getFn(obj);
        } catch (error) {
            //ignore
        }
    }
    return undefined;
}