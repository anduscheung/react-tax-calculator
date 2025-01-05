import Logger from "./logger";

describe("Logger.isProduction", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  const reloadLogger = () => {
    jest.resetModules();
    return require("./logger").default;
  };

  it("should return true when NODE_ENV is 'production'", () => {
    (process.env as any).NODE_ENV = "production";
    const Logger = reloadLogger();
    expect(Logger.isProduction).toBe(true);
  });

  it("should return false when NODE_ENV is 'development'", () => {
    (process.env as any).NODE_ENV = "development";
    const Logger = reloadLogger();
    expect(Logger.isProduction).toBe(false);
  });

  it("should return false when NODE_ENV is undefined", () => {
    delete (process.env as any).NODE_ENV;
    const Logger = reloadLogger();
    expect(Logger.isProduction).toBe(false);
  });

  it("should return false for any non-production NODE_ENV", () => {
    (process.env as any).NODE_ENV = "test";
    const Logger = reloadLogger();
    expect(Logger.isProduction).toBe(false);
  });
});

describe("Logger", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(console, "info").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  const mockIsProduction = (isProduction: boolean) => {
    jest.spyOn(Logger, "isProduction", "get").mockReturnValue(isProduction);
  };

  it("should not log info messages in production environments", () => {
    mockIsProduction(true);
    Logger.info("Test info message");
    expect(console.info).not.toHaveBeenCalled();
  });

  it("should log info messages in non-production environments", () => {
    mockIsProduction(false);
    Logger.info("Test info message");
    expect(console.info).toHaveBeenCalledWith("[INFO]: Test info message");
  });

  it("should log warn messages in all environments", () => {
    mockIsProduction(true);
    Logger.warn("Test warn message", { param: 2 });
    expect(console.warn).toHaveBeenCalledWith("[WARN]: Test warn message", {
      param: 2,
    });
  });

  it("should log error messages in all environments", () => {
    mockIsProduction(false);
    Logger.error("Test error message", { param: 3 });
    expect(console.error).toHaveBeenCalledWith("[ERROR]: Test error message", {
      param: 3,
    });
  });

  it("should call sendErrorToService in production on error", () => {
    mockIsProduction(true);

    const sendErrorSpy = jest.spyOn(console, "log");
    Logger.error("Production error message", { key: "value" });

    expect(sendErrorSpy).toHaveBeenCalledWith(
      "Simulating sending error to external service:",
      {
        error: "Production error message",
        context: [{ key: "value" }],
      }
    );
  });

  it("should not call sendErrorToService in non-production environments", () => {
    mockIsProduction(false);

    const sendErrorSpy = jest.spyOn(console, "log");
    Logger.error("Development error message", { key: "value" });

    expect(sendErrorSpy).not.toHaveBeenCalled();
  });
});
