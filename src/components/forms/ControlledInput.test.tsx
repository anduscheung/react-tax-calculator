import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
  renderHook,
} from "@testing-library/react";
import { useForm } from "react-hook-form";
import ControlledInput from "./ControlledInput";

describe("ControlledInput Component", () => {
  test("should call customOnChange with correct arguments", async () => {
    const { result } = renderHook(() => useForm());

    const customOnChange = jest.fn();

    render(
      <ControlledInput
        name="testInput"
        label="Test Label"
        control={result.current.control}
        customOnChange={customOnChange}
        testId="input"
      />
    );

    const input = screen.getByTestId("input");
    fireEvent.change(input, { target: { value: "Test Value" } });

    expect(customOnChange).toHaveBeenCalledWith(
      "Test Value",
      expect.objectContaining({
        onChange: expect.any(Function),
      })
    );
  });

  test("should show error message when validation fails", async () => {
    const { result } = renderHook(() => useForm());

    render(
      <ControlledInput
        name="testInput"
        label="Test Label"
        control={result.current.control}
        rules={{ required: "This field is required" }}
        testId="input"
      />
    );

    act(() => {
      result.current.setError("testInput", {
        type: "required",
        message: "This field is required",
      });
    });

    await waitFor(() => {
      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });
  });

  test("should disable input when isLoading is true", () => {
    const { result } = renderHook(() => useForm());

    render(
      <ControlledInput
        name="testInput"
        label="Test Label"
        control={result.current.control}
        isLoading={true}
        testId="input"
      />
    );

    const input = screen.getByTestId("input");
    expect(input).toBeDisabled();
  });
});
