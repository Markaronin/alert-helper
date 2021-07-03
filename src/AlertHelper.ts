import { Alert } from "./Alert";

class AlertHelper {
    addAlertFunction?: (alert: Alert) => void;

    addAlert(alert: Alert | Omit<Alert, "duration">): void {
        if (this.addAlertFunction) {
            this.addAlertFunction({ duration: 5, ...alert });
        } else {
            throw new Error("Somehow addAlert was not defined");
        }
    }
}

export const alertHelper = new AlertHelper();
