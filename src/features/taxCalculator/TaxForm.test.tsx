import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  renderHook,
} from "@testing-library/react";
import { useForm } from "react-hook-form";
import TaxForm from "./TaxForm";
import { FormInputs } from "./TaxCalculator";

describe("TaxForm Component", () => {
  test("should render ControlledInput and ControlledDropdown correctly", () => {
    const { result } = renderHook(() => useForm<FormInputs>());

    render(<TaxForm control={result.current.control} isLoading={false} />);

    expect(screen.getByTestId("tax-form")).toBeInTheDocument();
    expect(screen.getByTestId("tax-form-income-field")).toBeInTheDocument();
    expect(screen.getByTestId("tax-form-year-dropdown")).toBeInTheDocument();
    expect(screen.getByText("Annual Income")).toBeInTheDocument();
    expect(screen.getByText("Tax Year")).toBeInTheDocument();
  });

  test("should validate input as a number", async () => {
    const { result } = renderHook(() =>
      useForm<FormInputs>({ mode: "onChange" })
    );

    render(<TaxForm control={result.current.control} isLoading={false} />);

    const input = screen.getByTestId("tax-form-income-field");

    act(() => {
      fireEvent.change(input, { target: { value: "abc" } });
    });

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a number (e.g. 100000/-100000)")
      ).toBeInTheDocument();
    });

    act(() => {
      fireEvent.change(input, { target: { value: "100000" } });
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Please enter a number (e.g. 100000/-100000)")
      ).not.toBeInTheDocument();
    });
  });

  test("should handle custom input changes correctly", () => {
    const { result } = renderHook(() => useForm<FormInputs>());

    render(<TaxForm control={result.current.control} isLoading={false} />);

    const input = screen.getByTestId("tax-form-income-field");

    act(() => {
      fireEvent.change(input, { target: { value: "00123" } });
    });

    expect(result.current.getValues("income")).toBe("123");

    act(() => {
      fireEvent.change(input, { target: { value: "" } });
    });

    expect(result.current.getValues("income")).toBe("0");
  });

  test("should disable input when isLoading is true", () => {
    const { result } = renderHook(() => useForm<FormInputs>());

    render(<TaxForm control={result.current.control} isLoading={true} />);

    const input = screen.getByTestId("tax-form-income-field");
    expect(input).toBeDisabled();

    const dropdown = screen.getByTestId("tax-form-year-dropdown");
    expect(dropdown).not.toBeDisabled();
  });
});
