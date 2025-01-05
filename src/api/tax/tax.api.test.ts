import { fetchTaxRates } from "./tax.api";
import axios from "axios";
import Logger from "../../utils/logger";
import axiosInstance from "../axiosInstance";

jest.mock("../axiosInstance");
jest.mock("../../utils/logger");

const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;
const mockLogger = Logger as jest.Mocked<typeof Logger>;

describe("fetchTaxRates", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch tax rates successfully", async () => {
    const mockResponse = {
      tax_brackets: [
        { min: 0, max: 50000, rate: 0.1 },
        { min: 50000, max: 100000, rate: 0.2 },
      ],
    };

    mockAxiosInstance.get.mockResolvedValueOnce({ data: mockResponse });

    const result = await fetchTaxRates(2022);

    expect(result).toEqual(mockResponse.tax_brackets);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith(
      "/tax-calculator/tax-year/2022",
      expect.any(Object)
    );
  });

  it("should throw cancel error if request is canceled", async () => {
    const cancelError = new axios.Cancel("Request canceled");
    mockAxiosInstance.get.mockRejectedValueOnce(cancelError);

    await expect(fetchTaxRates(2022)).rejects.toThrowError("Request canceled");
    expect(mockLogger.warn).toHaveBeenCalledWith(
      "Request canceled by the user:",
      "Request canceled"
    );
  });

  it("should log and throw an error for non-cancel errors", async () => {
    const networkError = new Error("Network error");
    mockAxiosInstance.get.mockRejectedValueOnce(networkError);

    await expect(fetchTaxRates(2022)).rejects.toThrowError(
      "Failed to fetch tax rates."
    );
    expect(mockLogger.error).toHaveBeenCalledWith(
      "Failed to fetch tax rates.",
      {
        year: 2022,
        error: networkError,
      }
    );
  });
});
