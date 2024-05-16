import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductForm = () => {
  const [name, setName] = useState('');
  const [inventory, setInventory] = useState('');
  const [type, setType] = useState('gadget');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error('Name cannot be empty');
      return;
    }

    if (isNaN(inventory) || inventory <= 0) {
      toast.error('Inventory must be a positive number');
      return;
    }

    setLoading(true);

    const query = `
      mutation {
        createProduct(newProduct: {
          name: "${name}", inventory: ${inventory}, type: ${type}
        }) {
          id
          name
        }
      }
    `;

    try {
      const response = await axios.post('http://localhost:8080/graphql', { query });
      if (response.data.errors) {
        toast.error('An error occurred');
      } else {
        toast.success('Product added successfully');
        setName('');
        setInventory('');
        setType('gadget');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="inventory">
            Inventory
          </label>
          <input
            type="number"
            id="inventory"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={inventory}
            onChange={(e) => setInventory(e.target.value)}
          />
        </div>
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
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading && 'opacity-50 cursor-not-allowed'}`}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ProductForm;

