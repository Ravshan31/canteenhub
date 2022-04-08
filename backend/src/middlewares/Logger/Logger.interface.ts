export interface ICustomLogger {
    useLog: (...args: unknown[]) => void;
    useError: (...args: unknown[]) => void;
    useWarn: (...args: unknown[]) => void;
}