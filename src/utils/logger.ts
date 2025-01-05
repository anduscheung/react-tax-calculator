class Logger {
  static get isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  }

  private static sendErrorToService(error: string, context?: any) {
    console.log("Simulating sending error to external service:", {
      error,
      context,
    });
  }

  static info(message: string, ...optionalParams: any[]) {
    if (!Logger.isProduction) {
      console.info(`[INFO]: ${message}`, ...optionalParams);
    }
  }

  static warn(message: string, ...optionalParams: any[]) {
    console.warn(`[WARN]: ${message}`, ...optionalParams);
  }

  static error(message: string, ...optionalParams: any[]) {
    console.error(`[ERROR]: ${message}`, ...optionalParams);
    if (Logger.isProduction) {
      Logger.sendErrorToService(message, optionalParams);
    }
  }
}

export default Logger;
