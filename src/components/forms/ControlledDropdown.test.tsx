import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  renderHook,
} from "@testing-library/react";
import { useForm } from "react-hook-form";
import ControlledDropdown from "./ControlledDropdown";

describe("ControlledDropdown Component", () => {
  test("should call customOnChange with correct arguments", async () => {
    const { result } = renderHook(() => useForm());

    const customOnChange = jest.fn();
    const options = [{ value: "1", label: "Option 1" }];

    render(
      <ControlledDropdown
        name="testDropdown"
        label="Test Label"
        control={result.current.control}
        options={options}
        customOnChange={customOnChange}
        testId="dropdown"
      />
    );

    act(() => {
      fireEvent.mouseDown(document.querySelector(".ant-select-selector")!);
    });

    await waitFor(async () => {
      const option = await waitFor(() => screen.getByText("Option 1"));
      fireEvent.click(option);
      expect(customOnChange).toHaveBeenCalledWith(
        "1",
        expect.objectContaining({
          onChange: expect.any(Function),
        })
      );
    });
  });

  test("should show error message when validation fails", async () => {
    const { result } = renderHook(() => useForm());

    render(
      <ControlledDropdown
        name="testDropdown"
        label="Test Label"
        control={result.current.control}
        options={[]}
        rules={{ required: "This field is required" }}
        testId="dropdown"
      />
    );

    act(() => {
      result.current.setError("testDropdown", {
        type: "required",
        message: "This field is required",
      });
    });

    await waitFor(async () => {
      expect(screen.getByText("This field is required")).toBeInTheDocument();
      const errorMessage = await screen.findByText("This field is required");
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test("should disable dropdown when isLoading is true", async () => {
    const { result } = renderHook(() => useForm());

    const options = [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
    ];

    render(
      <ControlledDropdown
        name="testDropdown"
        label="Test Label"
        control={result.current.control}
        options={options}
        isLoading={true}
        testId="dropdown"
      />
    );

    const dropdown = screen.getByTestId("dropdown");
    expect(dropdown).toHaveClass("ant-select-disabled");
  });
});
