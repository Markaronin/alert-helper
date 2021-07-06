import React, { Component } from "react";

type AlertSeverity = "info" | "error" | "warn";

interface Alert {
    severity: AlertSeverity;
    message: string;
    duration: number;
}

class AlertHelper {
    private readonly alertQueue: Alert[] = [];
    private hasAlertFunctionBeenSet = false;

    public setAlertFunction(newAlertFunction: (alert: Alert) => void) {
        if (!this.hasAlertFunctionBeenSet) {
            this.hasAlertFunctionBeenSet = true;
            this.addAlert = newAlertFunction;
            this.alertQueue.forEach((alert) => this.addAlert(alert));
            // Clean queue out
            this.alertQueue.splice(0, this.alertQueue.length);
        } else {
            throw new Error("Tried to set alert function after it was already set");
        }
    }

    public addAlert: (alert: Alert) => void = (alert: Alert) => {
        this.alertQueue.push(alert);
    };
}

export const alertHelper = new AlertHelper();

interface AlertHelperComponentProps {}
interface AlertHelperComponentState {
    alerts: Record<number, Alert>;
}
export class AlertHelperComponent extends Component<AlertHelperComponentProps, AlertHelperComponentState> {
    private nextAlertId = 0;
    private timeouts: number[] = [];
    constructor(props: AlertHelperComponentProps) {
        super(props);
        alertHelper.setAlertFunction((alert: Alert) => this.addAlertFunction(alert));
        this.state = {
            alerts: {},
        };
    }

    private addAlertFunction = (alert: Alert): void => {
        const newAlertId = this.nextAlertId++;
        const newAlerts: Record<number, Alert> = {};
        newAlerts[newAlertId] = alert;
        this.setState({ alerts: { ...this.state.alerts, ...newAlerts } });
        this.timeouts.push(
            window.setTimeout(() => {
                this.setState({
                    alerts: Object.fromEntries(
                        Object.entries(this.state.alerts).filter((entry) => parseInt(entry[0]) !== newAlertId),
                    ),
                });
            }, alert.duration * 1000),
        );
    };

    componentWillUnmount(): void {
        this.timeouts.forEach((timeoutNumber) => {
            clearTimeout(timeoutNumber);
        });
    }

    private static readonly severityToColorMap: Record<AlertSeverity, string> = {
        error: "rgb(251, 164, 164)",
        info: "rgb(206, 245, 144)",
        warn: "rgb(253, 243, 150)",
    };

    render(): JSX.Element {
        return (
            <div
                style={{
                    position: "absolute",
                    zIndex: 999,
                    margin: "auto",
                    left: 0,
                    right: 0,
                    width: "25%",
                }}
            >
                {Object.entries(this.state.alerts).map((entry) => (
                    <div
                        style={{
                            backgroundColor: AlertHelperComponent.severityToColorMap[entry[1].severity],
                            border: "0.05em solid black",
                            borderRadius: "0.2em",
                            padding: "0.5em",
                            textAlign: "center",
                            marginBottom: "0.5em",
                        }}
                        className={`alert ${entry[1].severity}`}
                        key={parseInt(entry[0])}
                    >
                        {entry[1].message}
                    </div>
                ))}
            </div>
        );
    }
}
