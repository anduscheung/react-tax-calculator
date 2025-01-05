import React from "react";
import {
  Controller,
  Control,
  RegisterOptions,
  Path,
  FieldValues,
} from "react-hook-form";
import { Select, Form } from "antd";

const { Option } = Select;

type ControlledDropdownProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
  rules?: RegisterOptions<T>;
  options: { value: number | string; label: string }[];
  isLoading?: boolean;
  customOnChange?: (
    value: string | number,
    field: { onChange: (value: string | number) => void }
  ) => void;
  testId: string;
};

const ControlledDropdown = <T extends FieldValues>({
  name,
  label,
  control,
  rules,
  options,
  isLoading = false,
  customOnChange,
  testId,
}: ControlledDropdownProps<T>): React.ReactElement => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field, fieldState: { error } }) => (
      <Form.Item
        label={label}
        validateStatus={error ? "error" : ""}
        help={error?.message ?? ""}
        layout="vertical"
      >
        <Select
          data-testid={testId}
          {...field}
          onChange={(value) =>
            customOnChange
              ? customOnChange(value, field)
              : field.onChange(value)
          }
          disabled={isLoading}
        >
          {options.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    )}
  />
);

export default ControlledDropdown;
