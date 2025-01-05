import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider, UseQueryResult } from "react-query";
import TaxCalculator from "./TaxCalculator";
import * as ReactQuery from "react-query";
import * as taxUtils from "../../utils/tax.utils";
import {
  TAX_RATES_STALE_TIME,
  TAX_RATES_CACHE_TIME,
  DEFAULT_FORM_VALUES,
} from "../../constants/tax.constants";

jest.mock("../../api/tax/tax.api");

describe("TaxCalculator", () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <TaxCalculator />
      </QueryClientProvider>
    );

  it("should render the TaxForm and TaxResult components initially", async () => {
    renderComponent();

    await waitFor(() => {
      const taxForm = screen.getByTestId("tax-form");
      const taxResult = screen.getByTestId("tax-result");

      expect(taxForm).toBeInTheDocument();
      expect(taxResult).toBeInTheDocument();
    });
  });

  it("should call useQuery with the correct default parameters and render result initially", async () => {
    const useQuerySpy = jest.spyOn(ReactQuery, "useQuery");
    const mockCalculation: taxUtils.TaxCalculation = {
      totalTax: 14000,
      taxesPerBand: [
        { band: "0-50000", tax: 5000, rate: 0.1 },
        { band: "50000-100000", tax: 6000, rate: 0.2 },
        { band: "100000-∞", tax: 3000, rate: 0.3 },
      ],
      effectiveRate: 14000 / 75000,
    };
    const mockCalculateTaxes = jest
      .spyOn(taxUtils, "calculateTaxes")
      .mockReturnValue(mockCalculation);

    const mockTaxBrackets = [{ rate: 0.1, threshold: 50000 }];

    useQuerySpy.mockReturnValue({
      data: mockTaxBrackets,
      isLoading: false,
      isError: false,
    } as unknown as UseQueryResult<typeof mockTaxBrackets>);

    renderComponent();

    const QUERY_KEYS = ["taxRates", DEFAULT_FORM_VALUES.year];
    expect(useQuerySpy).toHaveBeenCalledWith(QUERY_KEYS, expect.any(Function), {
      staleTime: TAX_RATES_STALE_TIME,
      cacheTime: TAX_RATES_CACHE_TIME,
      retry: 1,
      refetchOnWindowFocus: false,
    });

    await waitFor(() => {
      expect(mockCalculateTaxes).toHaveBeenCalledWith(
        DEFAULT_FORM_VALUES.income,
        mockTaxBrackets
      );
    });

    expect(screen.getByText(/Tax Calculation Results:/i)).toBeInTheDocument();

    useQuerySpy.mockRestore();
    mockCalculateTaxes.mockRestore();
  });
});
