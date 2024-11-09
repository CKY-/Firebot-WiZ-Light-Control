import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { changeBrightness, changeLightModeSceneAndBrightness, changeLightScene } from "../../wiz-lights"
import { logger } from "../../logger";
import { Scene } from "../../../wiz-local-control/dist/classes/LightMode";

export const setWizLightSceneEffectType: Firebot.EffectType<{
    lightCollectionName: string;
    sceneCollectionName: Scene;
    brightness: number;
    setBrightness: boolean;
    setScene: boolean;
}> = {
    definition: {
        id: "cky:wiz-set-light-scene",
        name: "Wiz Light Set Scene",
        description: "Set Wiz Light Scene",
        icon: "fad fa-lightbulb",
        categories: ["common"],
    },
    optionsTemplate: `
    <eos-container header="Set Wiz Light">
        <div class="btn-group" uib-dropdown>
            <button type="button" class="btn btn-default" uib-dropdown-toggle>
              {{effect.custom ? 'Custom': effect.lightCollectionName}} <span class="caret"></span>
            </button>
            <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="single-button">
                <li role="menuitem" ng-repeat="lightCollection in lightCollections" ng-click="selectlightCollection(lightCollection)">
                    <a href>{{lightCollection}}</a>
                </li>
                <li role="menuitem" ng-show="lightCollection.length < 1" class="muted">
                    <a>collections found.</a>
                </li>
                <li role="separator" class="divider"></li>
                <li role="menuitem" ng-click="effect.custom = true;">
                    <a href>Set custom</a>
                </li>
            </ul>
        </div>
        <p>
            <button class="btn btn-link" ng-click="getlightCollections()">Refresh List</button>
        </p>

        <div ng-show="effect.custom === true" style="margin-top:10px;">
            <firebot-input input-title="IP of light to control" model="effect.lightCollectionName"></firebot-input>
        </div>
        <div>
            <label class="control-fb control--checkbox">Brightness
                <input type="checkbox" ng-click="effect.setBrightness = !effect.setBrightness" ng-checked="effect.setBrightness" aria-label="..." >
                <div class="control__indicator"></div>
            </label>
        </div>
        <div>
            <label class="control-fb control--checkbox">Scene
                <input type="checkbox" ng-click="effect.setScene = !effect.setScene" ng-checked="effect.setScene" aria-label="..." >
                <div class="control__indicator"></div>
            </label>  
        </div>
    </eos-container>
    <eos-container ng-show="effect.setBrightness == true" header="Brightness" pad-top="true">
            <div class="volume-slider-wrapper">
               <i class="fal fa-light fa-lightbulb volume-low"></i>
                <rzslider rz-slider-model="effect.brightness" rz-slider-options="{floor: 10, ceil: 100, hideLimitLabels: true, showSelectionBar: true}"></rzslider>
               <i class="fal fa-light fa-lightbulb-on volume-high"></i>
            </div>
    </eos-container>
    <eos-container ng-show="effect.setScene == true" header="scene" pad-top="true">
        <div class="btn-group" uib-dropdown>
            <button type="button" class="btn btn-default" uib-dropdown-toggle>
              {{effect.sceneCollectionName.name}} <span class="caret"></span>
            </button>
            <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="single-button">
                <li role="menuitem" ng-repeat="sceneCollection in sceneCollections" ng-click="selectSceneCollection(sceneCollection)">
                    <a href>{{sceneCollection.name}}</a>
                </li>
                <li role="menuitem" ng-show="sceneCollection.length < 1" class="muted">
                    <a>collections found.</a>
                </li>
            </ul>
        </div>
    </eos-container>
  `,
    optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
        $scope.lightCollections = [];
        if ($scope.effect.setBrighteness == null) {
            $scope.effect.setBrighteness = false;
        }

        if ($scope.effect.setScene == null) {
            $scope.effect.setScene = false;
        }

        if ($scope.effect.brightness == null) {
            $scope.effect.brightness = 10;
        }

        $scope.selectlightCollection = (lightCollection: string) => {
            $scope.effect.custom = false;
            $scope.effect.lightCollectionName = lightCollection;
        };

        $scope.getlightCollections = () => {
            $q.when(backendCommunicator.fireEventAsync("wiz-get-collection")).then(
                (lightCollections: string[]) => {
                    $scope.lightCollections = lightCollections ?? [];
                }
            );
        };
        $scope.getlightCollections();

        $scope.selectSceneCollection = (sceneCollection: Scene) => {
            $scope.effect.sceneCollectionName = sceneCollection;
        };

        $scope.getSceneCollections = () => {
            $q.when(backendCommunicator.fireEventAsync("wiz-get-scene-list")).then(
                (sceneCollections: Scene[]) => {
                    $scope.sceneCollections = sceneCollections ?? [];
                }
            );
        };
        $scope.getSceneCollections();

    },
    optionsValidator: (effect) => {
        if (effect.lightCollectionName == null) {
            return ["Please select a Connection."];
        }
        if (effect.sceneCollectionName == null) {
            return ["Please select a Scene."];
        }
        if (effect.setScene == false) {
            return ["Please select a Scene."];
        }

        return [];
    },
    onTriggerEvent: async ({ effect }) => {

        if (effect.setScene == true && effect.setBrightness == false) {
            logger.error(JSON.stringify(effect.sceneCollectionName.name))
            changeLightScene(effect.lightCollectionName, effect.sceneCollectionName);
        }

        if (effect.setScene == false && effect.setBrightness == true) {
            changeBrightness(effect.lightCollectionName, effect.brightness);
        }

        if (effect.setScene == true && effect.setBrightness == true) {
            changeLightModeSceneAndBrightness(effect.lightCollectionName, effect.sceneCollectionName, effect.brightness);
        }
        return true;
    },
};
