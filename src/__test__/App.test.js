import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { toast } from "react-toastify";
import ProductForm from "../components/ProductForm";
import { ApolloProvider } from "@apollo/client";
import client from "../apolloClient";
import FindAvailableProductForm from "../components/FindAvailableProductForm";
import CartForm from "../components/CartForm";
import { startGraphQlStub, stopGraphQlStub } from "specmatic";

global.setImmediate = global.setImmediate || ((fn, ...args) => global.setTimeout(fn, 0, ...args));
let stub;

beforeAll(async () => {
  stub = await startGraphQlStub("127.0.0.1", 8080, "./expectations");
}, 5000);

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn(),
  },
  toastContainer: jest.fn(),
}));

describe("App component tests", () => {
  // Test for the create cart form
  test('creates a cart and displays cart details', async () => {
    render(
      <ApolloProvider client={client}>
        <CartForm />
      </ApolloProvider>
    );

    // Simulate form submission for creating a cart
    fireEvent.click(screen.getByTestId('createCartButton'));

    // Wait for the cart details to be displayed
    const cartDetails = await screen.findByTestId('cartDetails');

    expect(cartDetails).toBeInTheDocument();
    expect(screen.getByTestId('firstName')).toHaveValue('John');
    expect(screen.getByTestId('surname')).toHaveValue('Doe');
    expect(screen.getByTestId('phone')).toHaveValue('1234567890');
  });

  // Test for the fetch cart form
  test('fetches a cart by ID and displays cart details', async () => {
    render(
      <ApolloProvider client={client}>
        <CartForm />
      </ApolloProvider>
    );

    // Simulate form submission for fetching a cart
    fireEvent.click(screen.getByTestId('fetchCartButton'));

    // Wait for the cart details to be displayed
    const fetchedCartDetails = await screen.findByTestId('fetchedCartDetails');

    expect(fetchedCartDetails).toBeInTheDocument();
    expect(screen.getByTestId('firstName')).toHaveValue('John');
    expect(screen.getByTestId('surname')).toHaveValue('Doe');
    expect(screen.getByTestId('phone')).toHaveValue('1234567890');
  });
});

afterAll(async () => {
  await stopGraphQlStub(stub);
}, 5000);
