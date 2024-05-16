import React, { useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FIND_AVAILABLE_PRODUCTS = gql`
  query FindAvailableProducts($type: ProductType!, $pageSize: Int!) {
    findAvailableProducts(type: $type, pageSize: $pageSize) {
      id
      name
      inventory
      type
    }
  }
`;

const FindAvailableProductForm = () => {
  const [type, setType] = useState('gadget');
  const [pageSize, setPageSize] = useState('');
  const [products, setProducts] = useState(null);
  
  const [findAvailableProducts, { loading }] = useLazyQuery(FIND_AVAILABLE_PRODUCTS, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      setProducts(data.findAvailableProducts);
    },
    onError: () => {
      toast.dismiss();
      toast.error('An error occurred');
    },
  });

  const handleSubmit = async (e) => {
    console.log("form submitted --> ");
    e.preventDefault();

    if (isNaN(pageSize) || pageSize <= 0) {
      toast.dismiss();
      toast.error('Page size must be a positive number');
      return;
    }
    
    console.log("hitting findAvailableProducts --> ", type, pageSize);
    findAvailableProducts({ variables: { type, pageSize: parseInt(pageSize, 10) } });
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Find Available Products</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
            Type
          </label>
          <select
            id="type"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="gadget">Gadget</option>
            <option value="book">Book</option>
            <option value="food">Food</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pageSize">
            Page Size
          </label>
          <input
            type="number"
            id="pageSize"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading && 'opacity-50 cursor-not-allowed'}`}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
      {products && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Available Products</h2>
          <div className="grid grid-cols-1 gap-4">
            {products.map((product) => (
              <div key={product.id} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
                <p><strong>ID:</strong> {product.id}</p>
                <p><strong>Name:</strong> {product.name}</p>
                <p><strong>Inventory:</strong> {product.inventory}</p>
                <p><strong>Type:</strong> {product.type}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FindAvailableProductForm;

