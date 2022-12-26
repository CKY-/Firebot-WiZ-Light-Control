import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { setupFrontendListeners } from "./firebot/communicator";
import { initRemote } from "./wiz-lights";
import { setWizLightColorEffectType } from "./firebot/effects/wiz-light-set-color";
import { turnWizLightOnEffectType } from "./firebot/effects/wiz-light-on";
import { turnWizLightOffEffectType } from "./firebot/effects/wiz-light-off";
import { setWizLightSceneEffectType } from "./firebot/effects/wiz-light-set-scene";
import { setWizLightBrightnessEffectType } from "./firebot/effects/wiz-light-set-brightness";
import { initLogger } from "./logger";

interface Params {
  ipAddress: string;
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Wiz Lights",
      description: "Control Wiz lights from Events and commmands.",
      author: "CKY",
      version: "1.0",
      firebotVersion: "5",
      startupOnly: true,
    };
  },
  getDefaultParameters: () => {
    return {
      ipAddress: {
        type: "filepath",
        default: "",
        description: "List of ip addess file",
        secondaryDescription:
          "The ip address's of the first light to control",
        fileOptions: {
          directoryOnly: false, //set this to true if you want the user to only be able to select folders
          filters: [{ name: "Text", extensions: ["txt"] }],
          title: "Please Select A file",
          buttonLabel: "Select"
        }
      },
    };
  },
  run: async (runRequest) => {
    const { logger, eventManager } = runRequest.modules;
    initLogger(logger);
    initRemote(
      {
        ip: runRequest.parameters.ipAddress,
      },
      {
        eventManager,
      }
    );

    setupFrontendListeners(runRequest.modules.frontendCommunicator);
    runRequest.modules.effectManager.registerEffect(turnWizLightOnEffectType);
    runRequest.modules.effectManager.registerEffect(turnWizLightOffEffectType);
    runRequest.modules.effectManager.registerEffect(setWizLightColorEffectType);
    runRequest.modules.effectManager.registerEffect(setWizLightSceneEffectType);
    runRequest.modules.effectManager.registerEffect(setWizLightBrightnessEffectType);
  },
};

export default script;
