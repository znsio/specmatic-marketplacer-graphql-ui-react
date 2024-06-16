import React, { useState } from 'react';
import { useMutation, useLazyQuery, gql } from '@apollo/client';

// Function to generate the cart create mutation
const getCartCreateMutation = (firstName, surname, phone) => gql`
  mutation {
    cartCreate(input: { attributes: { firstName: "${firstName}", surname: "${surname}", phone: "${phone}" } }) {
      cart {
        id
        firstName
        surname
        phone
      }
    }
  }
`;

// Function to generate the cart query
const getCartQuery = (id) => gql`
  query {
    cart(id: "${id}") {
      id
      firstName
      surname
      phone
    }
  }
`;

const CartForm = () => {
  const [firstName, setFirstName] = useState('John');
  const [surname, setSurname] = useState('Doe');
  const [phone, setPhone] = useState('1234567890');
  const [cartId, setCartId] = useState('10');
  const [cartData, setCartData] = useState(null);
  const [fetchedCartData, setFetchedCartData] = useState(null);

  // Set up the mutation and query hooks
  const [createCartMutation, { data: createdCartData }] = useMutation(getCartCreateMutation(firstName, surname, phone));
  const [fetchCartQuery, { data: fetchedCart }] = useLazyQuery(getCartQuery(cartId));

  // Handle the cart creation
  const handleCreateCart = (e) => {
    e.preventDefault();
    createCartMutation();
  };

  // Handle the cart fetching
  const handleFetchCart = (e) => {
    e.preventDefault();
    fetchCartQuery();
  };

  // Update the state with the results of the mutation
  React.useEffect(() => {
    if (createdCartData) {
      setCartData(createdCartData.cartCreate.cart);
    }
  }, [createdCartData]);

  // Update the state with the results of the query
  React.useEffect(() => {
    if (fetchedCart) {
      setFetchedCartData(fetchedCart.cart);
    }
  }, [fetchedCart]);

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Create Cart</h1>
      <form onSubmit={handleCreateCart}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            data-testid="firstName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="surname">
            Surname
          </label>
          <input
            type="text"
            id="surname"
            data-testid="surname"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            data-testid="phone"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            data-testid="createCartButton"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Cart
          </button>
        </div>
      </form>

      {cartData && (
        <div className="mt-8" data-testid="cartDetails">
          <h2 className="text-xl font-bold mb-4">Cart Created</h2>
          <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
            <p><strong>ID:</strong> {cartData.id}</p>
            <p><strong>First Name:</strong> {cartData.firstName}</p>
            <p><strong>Surname:</strong> {cartData.surname}</p>
            <p><strong>Phone:</strong> {cartData.phone}</p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4 mt-8">Fetch Cart by ID</h1>
      <form onSubmit={handleFetchCart}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cartId">
            Cart ID
          </label>
          <input
            type="text"
            id="cartId"
            data-testid="cartId"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={cartId}
            onChange={(e) => setCartId(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            data-testid="fetchCartButton"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Fetch Cart
          </button>
        </div>
      </form>

      {fetchedCartData && (
        <div className="mt-8" data-testid="fetchedCartDetails">
          <h2 className="text-xl font-bold mb-4">Cart Details</h2>
          <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
            <p><strong>ID:</strong> {fetchedCartData.id}</p>
            <p><strong>First Name:</strong> {fetchedCartData.firstName}</p>
            <p><strong>Surname:</strong> {fetchedCartData.surname}</p>
            <p><strong>Phone:</strong> {fetchedCartData.phone}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartForm;