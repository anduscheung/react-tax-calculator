import { render, screen } from "@testing-library/react";
import ErrorMessage from "./ErrorMessage";

describe("ErrorMessage", () => {
  it("should render the error message correctly", () => {
    const testMessage = "This is a test error message";

    render(<ErrorMessage message={testMessage} />);

    expect(screen.getByText(`Error: ${testMessage}`)).toBeInTheDocument();

    expect(screen.getByText(`Error: ${testMessage}`)).toHaveStyle({
      color: "red",
    });
  });
});
