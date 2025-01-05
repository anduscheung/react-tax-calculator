import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useForm, Control } from "react-hook-form";
import TaxForm from "./TaxForm";
import TaxResult from "./TaxResult";
import { fetchTaxRates } from "../../api/tax/tax.api";
import {
  TAX_RATES_STALE_TIME,
  TAX_RATES_CACHE_TIME,
  DEFAULT_FORM_VALUES,
} from "../../constants/tax.constants";
import { calculateTaxes, TaxCalculation } from "../../utils/tax.utils";
import styles from "./TaxCalculator.module.scss";

export type FormInputs = {
  income: string;
  year: number;
};

const TaxCalculator: React.FC = () => {
  const { control, watch } = useForm<FormInputs>({
    mode: "onChange",
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const [calculation, setCalculation] = useState<TaxCalculation>();

  const income = watch("income");
  const year = watch("year");

  const {
    data: taxBrackets,
    isLoading,
    isError,
  } = useQuery(
    ["taxRates", year],
    ({ signal }) => fetchTaxRates(year, signal),
    {
      staleTime: TAX_RATES_STALE_TIME,
      cacheTime: TAX_RATES_CACHE_TIME,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (taxBrackets) {
      const result = calculateTaxes(income, taxBrackets);
      setCalculation(result);
    }
  }, [income, taxBrackets]);

  return (
    <div className={styles.root}>
      <h1 className={styles.taxCalculatorHeader}>Tax Calculator</h1>
      <div className={styles.taxCalculatorBody}>
        <TaxForm
          control={control as Control<FormInputs>}
          isLoading={isLoading}
        />
        <TaxResult
          isLoading={isLoading}
          isError={isError}
          calculation={calculation}
        />
      </div>
    </div>
  );
};

export default TaxCalculator;
