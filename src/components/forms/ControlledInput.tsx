import React from "react";
import {
  Controller,
  Control,
  RegisterOptions,
  Path,
  FieldValues,
} from "react-hook-form";
import { Input, Form } from "antd";

type ControlledInputProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
  rules?: RegisterOptions<T>;
  type?: string;
  isLoading?: boolean;
  customOnChange?: (
    value: string,
    field: { onChange: (value: string) => void }
  ) => void;
  testId: string;
};

const ControlledInput = <T extends FieldValues>({
  name,
  label,
  control,
  rules,
  type = "text",
  isLoading = false,
  customOnChange,
  testId,
}: ControlledInputProps<T>): React.ReactElement => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field, fieldState: { error } }) => {
      return (
        <Form.Item
          label={label}
          validateStatus={error ? "error" : ""}
          help={error?.message ?? ""}
          layout="vertical"
        >
          <Input
            data-testid={testId}
            {...field}
            type={type}
            onChange={(e) => {
              const value = e.target.value;
              customOnChange
                ? customOnChange(value, field)
                : field.onChange(value);
            }}
            disabled={isLoading}
          />
        </Form.Item>
      );
    }}
  />
);

export default ControlledInput;
