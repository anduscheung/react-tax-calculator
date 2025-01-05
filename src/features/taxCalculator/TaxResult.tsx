import React from "react";
import {
  formatBand,
  formatCurrency,
  formatPercentage,
} from "../../utils/format.utils";
import styles from "./TaxResult.module.scss";
import { TaxCalculation } from "../../utils/tax.utils";
import ErrorAlert from "../../components/alert/ErrorMessage";

type TaxResultProps = {
  isLoading: boolean;
  isError: boolean;
  calculation?: TaxCalculation;
};

const TaxResult: React.FC<TaxResultProps> = ({
  isLoading,
  isError,
  calculation,
}) => {
  const renderContent = () => {
    if (isError) {
      return (
        <ErrorAlert
          message={
            "Sorry, something went wrong, please refresh or try again later"
          }
        />
      );
    }

    if (isLoading || !calculation) {
      return "Loading tax data from server...";
    }

    const { totalTax, effectiveRate, taxesPerBand } = calculation;

    return (
      <>
        <h3>Tax Calculation Results:</h3>
        <p>Total Tax: {formatCurrency(totalTax)}</p>
        <p>Effective Tax Rate: {formatPercentage(effectiveRate)}</p>
        <h4>Taxes Per Band:</h4>
        <table>
          <thead>
            <tr>
              <th>Band</th>
              <th>Rate</th>
              <th>Tax Owed</th>
            </tr>
          </thead>
          <tbody>
            {taxesPerBand.map((band, index) => (
              <tr key={index}>
                <td>{formatBand(band.band)}</td>
                <td>{formatPercentage(band.rate)}</td>
                <td>{formatCurrency(band.tax)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <div className={styles.root} data-testid="tax-result">
      {renderContent()}
    </div>
  );
};

export default TaxResult;
