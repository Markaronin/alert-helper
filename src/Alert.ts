export type AlertSeverity = "info" | "error" | "warn";

export interface Alert {
    severity: AlertSeverity;
    message: string;
    duration: number;
}
