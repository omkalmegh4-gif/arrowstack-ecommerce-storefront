import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("Accessible E-Commerce Storefront", () => {
  it("renders products and searches the catalog", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /find joy in the everyday/i })).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox", { name: /search products/i }), { target: { value: "headphones" } });
    expect(screen.getByText("Studio Headphones")).toBeInTheDocument();
    expect(screen.queryByText("Ceramic Mug")).not.toBeInTheDocument();
  });
  it("adds a product and opens the cart", () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole("button", { name: /add to bag/i })[0]);
    fireEvent.click(screen.getByRole("button", { name: /cart/i }));
    expect(screen.getByRole("region", { name: /shopping cart/i })).toBeInTheDocument();
    expect(screen.getAllByText("Studio Headphones").length).toBeGreaterThan(1);
  });

  it("filters by category and can show saved favorites", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /^Home$/ }));
    expect(screen.getByText("Morning Ritual Mug")).toBeInTheDocument();
    expect(screen.queryByText("Studio Headphones")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^All$/ }));
    fireEvent.click(screen.getByRole("button", { name: /add studio headphones to favorites/i }));
    fireEvent.click(screen.getByRole("button", { name: /^Favorites$/ }));
    expect(screen.getByText("Studio Headphones")).toBeInTheDocument();
    expect(screen.queryByText("Ceramic Mug")).not.toBeInTheDocument();
  });

  it("updates the bag total when product quantity changes", () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole("button", { name: /add to bag/i })[0]);
    fireEvent.click(screen.getByRole("button", { name: /cart/i }));
    expect(screen.getAllByText("₹3,499").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /increase studio headphones/i }));
    expect(screen.getAllByText("₹6,998").length).toBeGreaterThan(0);
  });
  it("shows an empty search state", () => {
    render(<App />);
    fireEvent.change(screen.getByRole("textbox", { name: /search products/i }), { target: { value: "not-a-real-product" } });
    expect(screen.getByText(/nothing found just yet/i)).toBeInTheDocument();
  });
  it("validates checkout fields", () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole("button", { name: /add to bag/i })[0]);
    fireEvent.click(screen.getByRole("button", { name: /cart/i }));
    fireEvent.click(screen.getByRole("button", { name: /continue to checkout/i }));
    fireEvent.click(screen.getByRole("button", { name: /place demo order/i }));
    expect(screen.getByText(/enter your name/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
  });

  it("submits a valid demo order without taking payment", () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole("button", { name: /add to bag/i })[0]);
    fireEvent.click(screen.getByRole("button", { name: /cart/i }));
    fireEvent.click(screen.getByRole("button", { name: /continue to checkout/i }));
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Om Customer" } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "om@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /place demo order/i }));

    expect(screen.getByRole("status")).toHaveTextContent(/demo order.*no payment was taken/i);
    expect(screen.getByRole("button", { name: /shopping cart/i })).toHaveTextContent("0");
  });
});
