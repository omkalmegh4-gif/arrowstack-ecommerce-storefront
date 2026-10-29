import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("Accessible E-Commerce Storefront", () => {
  it("renders products and searches the catalog", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /find your next favorite/i })).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox", { name: /search products/i }), { target: { value: "headphones" } });
    expect(screen.getByText("Studio Headphones")).toBeInTheDocument();
    expect(screen.queryByText("Ceramic Mug")).not.toBeInTheDocument();
  });
  it("adds a product and opens the cart", () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole("button", { name: /add to bag/i })[0]);
    fireEvent.click(screen.getByRole("button", { name: /cart/i }));
    expect(screen.getByRole("region", { name: /shopping cart/i })).toBeInTheDocument();
    expect(screen.getByText("Studio Headphones")).toBeInTheDocument();
  });
  it("shows an empty search state", () => {
    render(<App />);
    fireEvent.change(screen.getByRole("textbox", { name: /search products/i }), { target: { value: "not-a-real-product" } });
    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
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
});
