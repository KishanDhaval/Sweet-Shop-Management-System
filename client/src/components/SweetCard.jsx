import React, { useState } from 'react';
import { Trash2, ShoppingCart, Package, AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import PurchaseForm from './PurchaseForm';
import RestockForm from './RestockForm';

const SweetCard = ({ sweet, onDelete, onDeleteByCategory, onPurchase, onRestock }) => {
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [showRestockForm, setShowRestockForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isLowStock = sweet.quantity < 20;

  const handlePurchase = (quantity) => {
    onPurchase(sweet.id, quantity);
    setShowPurchaseForm(false);
  };

  const handleRestock = (quantity) => {
    onRestock(sweet.id, quantity);
    setShowRestockForm(false);
  };

  const handleDelete = () => {
    onDelete(sweet.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{sweet.name}</h3>
              <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                {sweet.category}
              </span>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Price</span>
              <span className="text-lg font-bold text-gray-900">₹{sweet.price.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Stock</span>
              <div className="flex items-center space-x-2">
                <span className={`font-semibold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
                  {sweet.quantity}
                </span>
                {isLowStock && <AlertTriangle className="h-4 w-4 text-red-500" />}
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-2">
            <button
              onClick={() => setShowPurchaseForm(true)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Purchase</span>
            </button>
            
            <button
              onClick={() => setShowRestockForm(true)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <Package className="h-4 w-4" />
              <span>Restock</span>
            </button>
          </div>

          <button
            onClick={() => onDeleteByCategory(sweet.category)}
            className="w-full mt-3 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm transition-colors"
          >
            Delete All {sweet.category}
          </button>
        </div>
      </div>

      {/* Purchase Modal */}
      <Modal isOpen={showPurchaseForm} onClose={() => setShowPurchaseForm(false)}>
        <PurchaseForm
          sweet={sweet}
          onSubmit={handlePurchase}
          onCancel={() => setShowPurchaseForm(false)}
        />
      </Modal>

      {/* Restock Modal */}
      <Modal isOpen={showRestockForm} onClose={() => setShowRestockForm(false)}>
        <RestockForm
          sweet={sweet}
          onSubmit={handleRestock}
          onCancel={() => setShowRestockForm(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{sweet.name}"? This action cannot be undone.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SweetCard;