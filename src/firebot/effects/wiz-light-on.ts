import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { lightOn } from "../../wiz-lights"

export const turnWizLightOnEffectType: Firebot.EffectType<{
    lightCollectionName: string;
}> = {
    definition: {
        id: "cky:wiz-turn-light-on",
        name: "Wiz Light On",
        description: "Turn Wiz Light On",
        icon: "fad fa-lightbulb-on",
        categories: ["common"],
    },
    optionsTemplate: `
    <eos-container header="Turn Wiz Light On">
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
    </eos-container>
  `,
    optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
        $scope.lightCollections = [];

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
        return [];
    },
    onTriggerEvent: async ({ effect }) => {
        await lightOn(effect.lightCollectionName);
        return true;
    },
};

