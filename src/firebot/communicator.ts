import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";
import { Scene } from "../../wiz-local-control/dist/classes/LightMode";
import { getlightCollections, getSceneCollection } from "../wiz-lights";

export function setupFrontendListeners(
    frontendCommunicator: ScriptModules["frontendCommunicator"]
) {
    frontendCommunicator.onAsync<never, string[]>(
        "wiz-get-collection",
        getlightCollections
    );

     frontendCommunicator.onAsync<never, Scene[]>(
         "wiz-get-scene-list",
         getSceneCollection
     );
}