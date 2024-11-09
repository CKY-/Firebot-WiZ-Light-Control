import WiZLocalControl from "../wiz-local-control/dist";
import { WiZMessage, staticScenes } from "../wiz-local-control/dist/classes/types";
import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types/types/";
import { readFileSync } from "fs";
import { logger } from "./logger";
import { Scene } from "../wiz-local-control/dist/classes/LightMode";
const  tinycolor = require("tinycolor2");

export class lightCollections {
    private _path: string[]

    public get location() {
        return this._path;
    }

    public set location(path: string[]) {
        this._path = path;
    }
}

export function initRemote(
    {
        ip,
        adapter
    }: {
        ip: string;
        adapter: string;
    },
    modules: {
        eventManager: ScriptModules["eventManager"];
    }
) {
    eventManager = modules.eventManager;
    setFile(ip);
    setAdapter(adapter);
}

let eventManager: ScriptModules["eventManager"];
let filePath: string;
let selectedAdapter: string;

function setFile(ip: string) {
    filePath = ip;
}

function setAdapter(adapter: string) {
    selectedAdapter = adapter;
}

const detectedDevices = new lightCollections();
const wizLocalControl = new WiZLocalControl({
    incomingMsgCallback: (msg: WiZMessage, ip: string) => {
        logger.info(`Received the message from WiZ Light ${JSON.stringify(ip)}: ${JSON.stringify(msg)}`);
        detectedDevices.location.forEach(async (connection: string) => {
            if (!(connection == ip)) {
                detectedDevices.location.push(ip);
            }
        });
    },
    interfaceName: selectedAdapter
});

export async function getSceneCollection(): Promise<Scene[]> {
    let items: Scene[] = staticScenes;
    return items;
}

export async function getlightCollections(): Promise<string[]> {
    logger.info(`path of setting: ${filePath}`);

    if (filePath === undefined || filePath === "" || filePath === null) {
        logger.error(`Select a File`);
        return [];
    }
    let array: string[] = [];

    array = readFileSync(filePath, "utf-8").toString().replace(/\r\n/g, '\n').split('\n');
    logger.info(JSON.stringify(array))
    if (array.length > 0) {
        logger.info(JSON.stringify(array))
        return array;
    }
    logger.info(JSON.stringify(`array is blank`))
    return [];
}

export function connectToLight(ip: any) {
    wizLocalControl.udpManager.startListening();
}

export function changeLight(ip: any, color: any ) {
    var c = tinycolor(color);
    if (c.isValid() == true) {
        c = c.toRgb();
        wizLocalControl.changeLightMode({
            type: "color",
            r: c.r,
            g: c.g,
            b: c.b,
            cw: 0,
            ww: 0,
        }, ip
        );
    }
}

export function changeLightScene(ip: any, scene: Scene) {
        wizLocalControl.changeLightMode({
            type: "scene",
            sceneId: scene.sceneId,
            name: scene.name
        }, ip
        );
}

export function changeLightModeAndBrightness(ip: any, color: any, brigheness: number) {
    var c = tinycolor(color);
    if (c.isValid() == true) {
        c = c.toRgb();
        wizLocalControl.changeLightModeAndBrightness({
            type: "color",
            r: c.r,
            g: c.g,
            b: c.b,
            cw: 0,
            ww: 0,
        }, brigheness, ip
        );
    }
}

export function changeLightModeSceneAndBrightness(ip: any, scene: Scene, brigheness: number) {
    wizLocalControl.changeLightModeAndBrightness({
        type: "scene",
        sceneId: scene.sceneId,
        name: scene.name
    }, brigheness, ip
    );
}

export function changeBrightness( ip: string, brightness: number){
    wizLocalControl.changeBrightness(brightness, ip);
}

export function lightOn(ip: any) {
    wizLocalControl.changeStatus(true, ip);
}

export function lightOff(ip: any) {
    wizLocalControl.changeStatus(false, ip);
} 

export function getConfig(ip: any) {
    wizLocalControl.getSystemConfig(ip);
}