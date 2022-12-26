import { TypedEmitter } from "tiny-typed-emitter";
import { EventManager } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-manager";
import {
    IntegrationController,
    IntegrationData,
    IntegrationEvents
} from "@crowbartools/firebot-custom-scripts-types";

import { initRemote } from "../wiz-lights";

type WizSettings = {
    wizSettings: {
        ipAddress: string;
    };
};

class IntegrationEventEmitter extends TypedEmitter<IntegrationEvents> { }

class WizIntegration
    extends IntegrationEventEmitter
    implements IntegrationController<WizSettings>
{
    connected = false;

    constructor(private readonly eventManager: EventManager) {
        super();
    }

    private setupConnection(settings?: WizSettings) {
        if (!settings) {
            return;
        }
        const {
            wizSettings: { ipAddress },
        } = settings;
        initRemote(
            {
                ip: ipAddress,
            },
            {
                eventManager: this.eventManager,
            }
        );
    }

    init(
        linked: boolean,
        integrationData: IntegrationData<WizSettings>
    ): void | PromiseLike<void> {
        this.setupConnection(integrationData.userSettings);
    }

    onUserSettingsUpdate?(
        integrationData: IntegrationData<WizSettings>
    ): void | PromiseLike<void> {
        this.setupConnection(integrationData.userSettings);
    }
}
