import React from "react";
import { Control } from "react-hook-form";
import ControlledInput from "../../components/forms/ControlledInput";
import ControlledDropdown from "../../components/forms/ControlledDropdown";
import {
  addZeroIfNothing,
  isNumberString,
  removeLeadingZero,
} from "../../utils/form.utils";
import styles from "./TaxForm.module.scss";
import { FormInputs } from "./TaxCalculator";

type Props = {
  control: Control<FormInputs>;
  isLoading: boolean;
};

const TaxForm: React.FC<Props> = ({ control, isLoading }) => {
  return (
    <div className={styles.root} data-testid="tax-form">
      <ControlledInput
        testId="tax-form-income-field"
        name="income"
        label="Annual Income"
        control={control}
        rules={{
          validate: (value) => {
            // Note: here the value must be string because we have a customOnChange which the value is string
            if (!isNumberString(value as string)) {
              return "Please enter a number (e.g. 100000/-100000)";
            }
            return true;
          },
        }}
        type="text"
        isLoading={isLoading}
        customOnChange={(value, field) => {
          // Note: in here the value always comes as a string
          const updatedValue = addZeroIfNothing(removeLeadingZero(value));
          field.onChange(updatedValue);
        }}
      />
      <ControlledDropdown
        testId="tax-form-year-dropdown"
        name="year"
        label="Tax Year"
        control={control}
        options={[
          { value: 2019, label: "2019" },
          { value: 2020, label: "2020" },
          { value: 2021, label: "2021" },
          { value: 2022, label: "2022" },
        ]}
      />
    </div>
  );
};

export default TaxForm;
