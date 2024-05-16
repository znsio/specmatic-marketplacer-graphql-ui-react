import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/client/testing';
import { toast } from 'react-toastify';
import ProductForm from '../components/ProductForm';
import { gql } from '@apollo/client';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn()
  },
  toastContainer: jest.fn(),
}));

const CREATE_PRODUCT = gql`
    mutation {
      createProduct(newProduct: {
        name: "Test Product",
        inventory: 10,
        type: gadget
      }) {
        id
        name
        inventory
        type
      }
    }
`;

const mocks = [
  {
    request: {
      query: CREATE_PRODUCT,
      variables: {
        name: 'Test Product',
        inventory: 10,
        type: 'gadget',
      },
    },
    result: {
      data: {
        createProduct: {
          id: '1',
          name: 'Test Product',
          inventory: 10,
          type: 'gadget',
        },
      },
    },
  },
];

test('fills out the form and submits', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ProductForm />
    </MockedProvider>
  );

  // Fill out the form
  fireEvent.change(screen.getByTestId('name'), { target: { value: 'Test Product' } });
  fireEvent.change(screen.getByTestId('inventory'), { target: { value: '10' } });
  fireEvent.change(screen.getByTestId('type'), { target: { value: 'gadget' } });

  // Submit the form
  fireEvent.click(screen.getByTestId('submit'));

  // Wait for the mutation to be called
  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith('Product added successfully');
  });

  // Optionally, check if the form is cleared
  expect(screen.getByTestId('name').value).toBe('');
  expect(screen.getByTestId('inventory').value).toBe('');
  expect(screen.getByTestId('type').value).toBe('gadget');
});
