import { render, screen } from "@testing-library/react";
import TaxResult from "./TaxResult";
import { TaxCalculation } from "../../utils/tax.utils";

describe("TaxResult Component", () => {
  it("should show loading message when isLoading is true", () => {
    render(<TaxResult isLoading={true} isError={false} />);

    const loadingMessage = screen.getByText(/Loading tax data from server.../i);
    expect(loadingMessage).toBeInTheDocument();
  });

  it("should show error message when isError is true", () => {
    render(<TaxResult isLoading={false} isError={true} />);

    const errorMessage = screen.getByText(/Sorry, something went wrong/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("should show loading message when calculation is not provided and isLoading is false", () => {
    render(<TaxResult isLoading={false} isError={false} />);

    const loadingMessage = screen.getByText(/Loading tax data from server.../i);
    expect(loadingMessage).toBeInTheDocument();
  });

  it("should show tax results when calculation is provided and isLoading is false", () => {
    const mockCalculation: TaxCalculation = {
      totalTax: 14000,
      taxesPerBand: [
        { band: "0-50000", tax: 5000, rate: 0.1 },
        { band: "50000-100000", tax: 6000, rate: 0.2 },
        { band: "100000-∞", tax: 3000, rate: 0.3 },
      ],
      effectiveRate: 14000 / 75000, // 10000 total tax divided by 75000 total taxable income
    };

    render(
      <TaxResult
        isLoading={false}
        isError={false}
        calculation={mockCalculation}
      />
    );

    expect(screen.getByText(/Tax Calculation Results:/i)).toBeInTheDocument();
    expect(screen.getByText(/\$14,000.00/)).toBeInTheDocument();
    expect(screen.getByText(/18.67%/)).toBeInTheDocument();

    expect(screen.getByText(/\$50,000.00 or less/i)).toBeInTheDocument();
    expect(screen.getByText(/10.00%/)).toBeInTheDocument();
    expect(screen.getByText(/\$5,000.00/)).toBeInTheDocument();

    expect(screen.getByText(/\$50,000.00 - \$100,000.00/i)).toBeInTheDocument();
    expect(screen.getByText(/20.00%/)).toBeInTheDocument();
    expect(screen.getByText(/\$6,000.00/)).toBeInTheDocument();

    expect(screen.getByText(/More than \$100,000.00/i)).toBeInTheDocument();
    expect(screen.getByText(/30.00%/)).toBeInTheDocument();
    expect(screen.getByText(/\$3,000.00/)).toBeInTheDocument();
  });
});
