import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import AddressForm from "../components/AddressForm";
import "@testing-library/jest-dom";

// Mocking Autocomplete component
vi.mock("@react-google-maps/api", () => ({
  Autocomplete: ({ children }) => children,
}));

describe("AddressForm", () => {
  it("renders the form with inputs for origin and destination", () => {
    render(
      <AddressForm onSubmit={vi.fn()} onCancel={vi.fn()} isSubmitting={false} />
    );

    expect(screen.getByLabelText(/🚏 Pickup Address/)).toBeInTheDocument();
    expect(screen.getByLabelText(/🎯 Drop-off Address/)).toBeInTheDocument();
    expect(screen.getByText(/Get Route/)).toBeInTheDocument();
  });

  it("displays error message when required fields are missing", async () => {
    render(
      <AddressForm onSubmit={vi.fn()} onCancel={vi.fn()} isSubmitting={false} />
    );

    fireEvent.click(screen.getByText(/Get Route/));

    await waitFor(() => {
      expect(
        screen.getByText(/Both addresses are required/)
      ).toBeInTheDocument();
    });
  });

  it("displays error message when pickup and drop-off addresses are the same", async () => {
    render(
      <AddressForm onSubmit={vi.fn()} onCancel={vi.fn()} isSubmitting={false} />
    );

    fireEvent.change(screen.getByLabelText(/🚏 Pickup Address/), {
      target: { value: "Hong Kong" },
    });
    fireEvent.change(screen.getByLabelText(/🎯 Drop-off Address/), {
      target: { value: "Hong Kong" },
    });

    fireEvent.click(screen.getByText(/Get Route/));

    await waitFor(() => {
      expect(
        screen.getByText(/Pickup and drop-off addresses cannot be the same/)
      ).toBeInTheDocument();
    });
  });

  it("calls onSubmit with correct data when form is valid", async () => {
    const onSubmitMock = vi.fn();
    render(
      <AddressForm
        onSubmit={onSubmitMock}
        onCancel={vi.fn()}
        isSubmitting={false}
      />
    );

    fireEvent.change(screen.getByLabelText(/🚏 Pickup Address/), {
      target: { value: "Innocentre, Hong Kong" },
    });
    fireEvent.change(screen.getByLabelText(/🎯 Drop-off Address/), {
      target: { value: "Hong Kong International Airport" },
    });

    fireEvent.click(screen.getByText(/Get Route/));

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith({
        origin: "Innocentre, Hong Kong",
        destination: "Hong Kong International Airport",
      });
    });
  });

  it("calls handleReset when Reset button is clicked", async () => {
    const onCancelMock = vi.fn();
    render(
      <AddressForm
        onSubmit={vi.fn()}
        onCancel={onCancelMock}
        isSubmitting={false}
      />
    );

    fireEvent.click(screen.getByText(/Reset/));

    await waitFor(() => {
      expect(screen.getByLabelText(/🚏 Pickup Address/).value).toBe("");
      expect(screen.getByLabelText(/🎯 Drop-off Address/).value).toBe("");
    });
  });

  it("calls onCancel when Cancel button is clicked while submitting", async () => {
    const onCancelMock = vi.fn();
    render(
      <AddressForm
        onSubmit={vi.fn()}
        onCancel={onCancelMock}
        isSubmitting={true}
      />
    );

    fireEvent.click(screen.getByText(/Cancel/));

    await waitFor(() => {
      expect(onCancelMock).toHaveBeenCalled();
    });
  });

  it("swaps the origin and destination addresses when Swap button is clicked", async () => {
    render(
      <AddressForm onSubmit={vi.fn()} onCancel={vi.fn()} isSubmitting={false} />
    );

    fireEvent.change(screen.getByLabelText(/🚏 Pickup Address/), {
      target: { value: "Innocentre, Hong Kong" },
    });
    fireEvent.change(screen.getByLabelText(/🎯 Drop-off Address/), {
      target: { value: "Hong Kong International Airport" },
    });

    fireEvent.click(screen.getByText(/Swap Addresses/));

    await waitFor(() => {
      expect(screen.getByLabelText(/🚏 Pickup Address/).value).toBe(
        "Hong Kong International Airport"
      );
      expect(screen.getByLabelText(/🎯 Drop-off Address/).value).toBe(
        "Innocentre, Hong Kong"
      );
    });
  });
});
