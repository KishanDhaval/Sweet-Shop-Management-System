import React, { useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';

const PurchaseForm = ({ sweet, onSubmit, onCancel }) => {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (quantity <= 0 || !Number.isInteger(quantity)) {
      setError('Quantity must be a positive integer');
      return;
    }
    
    if (quantity > sweet.quantity) {
      setError(`Insufficient stock. Only ${sweet.quantity} items available`);
      return;
    }
    
    onSubmit(quantity);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value);
    
    if (error) {
      setError('');
    }
  };

  const totalPrice = (quantity * sweet.price).toFixed(2);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Purchase Sweet</h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">{sweet.name}</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Category: {sweet.category}</p>
          <p>Price: ₹{sweet.price.toFixed(2)}</p>
          <p>Available Stock: {sweet.quantity}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            max={sweet.quantity}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Total Price:</span>
            <span className="text-xl font-bold text-blue-600">₹{totalPrice}</span>
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Purchase</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PurchaseForm;