import axios from "axios";
import Logger from "../../utils/logger";
import axiosInstance from "../axiosInstance";
import { TaxBracket, FetchTaxRatesResponse } from "./tax.types";

export const fetchTaxRates = async (
  year: number,
  signal?: AbortSignal
): Promise<TaxBracket[]> => {
  try {
    const response = await axiosInstance.get<FetchTaxRatesResponse>(
      `/tax-calculator/tax-year/${year}`,
      {
        signal,
      }
    );
    return response.data.tax_brackets;
  } catch (error: any) {
    if (axios.isCancel(error)) {
      Logger.warn("Request canceled by the user:", error.message);
      throw error;
    }

    Logger.error("Failed to fetch tax rates.", { year, error });
    throw new Error("Failed to fetch tax rates.");
  }
};
