import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { changeBrightness, changeLight, changeLightModeAndBrightness } from "../../wiz-lights"

export const setWizLightColorEffectType: Firebot.EffectType<{
    lightCollectionName: string;
    color: string;
    brightness: number;
    setBrighteness: boolean;
    setColor: boolean;
}> = {
    definition: {
        id: "cky:wiz-set-light-color",
        name: "Wiz Light Set Color",
        description: "Set Wiz Light Color",
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
                <input type="checkbox" ng-click="effect.setBrighteness=!effect.setBrighteness" ng-checked="effect.setBrighteness" aria-label="..." >
                <div class="control__indicator"></div>
            </label>
        </div>
        <div>
            <label class="control-fb control--checkbox">Color
                <input type="checkbox" ng-click="effect.setColor=!effect.setColor" ng-checked="effect.setColor" aria-label="..." >
                <div class="control__indicator"></div>
            </label>  
        </div>
    </eos-container>
    <eos-container ng-show="effect.setBrighteness == true" header="Brightness" pad-top="true">
            <div class="volume-slider-wrapper">
                <i class="fal fa-light fa-lightbulb volume-low"></i>
                    <rzslider rz-slider-model="effect.brightness" rz-slider-options="{floor: 10, ceil: 100, hideLimitLabels: true, showSelectionBar: true}"></rzslider>
                <i class="fal fa-light fa-lightbulb-on volume-high"></i>
            </div>
    </eos-container>
    <eos-container ng-show="effect.setColor == true" header="Color" pad-top="true">
        <div style="margin-top:10px;">
            <firebot-input input-title="Color" model="effect.color"></firebot-input>
            <p>
                <a ng-click="openLink('https://www.jsdocs.io/package/@types/tinycolor2')"
                    class="clickable"
                    uib-tooltip="View Color Documentation"
                    aria-label="View Color Documentation"
                    tooltip-append-to-body="true">
                    View Color Documentation 
                </a>
            </p>
        </div>
    </eos-container>
  `,
    optionsController: ($scope: any, backendCommunicator: any, $q: any, $rootScope: any) => {
        $scope.lightCollections = [];

        $scope.openLink = $rootScope.openLinkExternally;

        if ($scope.effect.setBrighteness == null) {
            $scope.effect.setBrighteness = false;
        }
        if ($scope.effect.setColor == null) {
            $scope.effect.setColor = false;
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
    },
    optionsValidator: (effect) => {
        if (effect.lightCollectionName == null) {
            return ["Please select a Connection."];
        } 
        if (effect.color == null) {
            return ["Please select set a color."];
        }
        if (effect.setColor == false) {
            return ["Please select set a color."];
        }
        return [];
    },
    onTriggerEvent: async ({ effect }) => {
        if (effect.setBrighteness == true && effect.setColor == false) {
            changeLight(effect.lightCollectionName, effect.color);
        }

        if (effect.setColor == true && effect.setBrighteness == false) {
            changeBrightness(effect.lightCollectionName, effect.brightness);
        }

        if (effect.setColor == true && effect.setBrighteness == true) {
            changeLightModeAndBrightness(effect.lightCollectionName, effect.color, effect.brightness);
        }
        return true;
    },
};
