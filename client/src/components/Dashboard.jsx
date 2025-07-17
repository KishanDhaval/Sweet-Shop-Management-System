import React, { useState, useEffect } from 'react';
import { Plus, Search, ShoppingCart, Package, Trash2, Edit, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { api } from '../services/api';
import AddSweetForm from './AddSweetForm';
import SweetCard from './SweetCard';
import SearchPanel from './SearchPanel';
import Modal from './Modal';

const Dashboard = () => {
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sortOrder, setSortOrder] = useState(null); // null, 'asc', 'desc'
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Load sweets from server
  useEffect(() => {
    loadSweets();
  }, []);

  const loadSweets = async () => {
    try {
      setLoading(true);
      const data = await api.getAllSweets();
      setSweets(data);
      setFilteredSweets(data);
    } catch (error) {
      showNotification('Failed to load sweets: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const handleAddSweet = async (sweetData) => {
    try {
      const newSweet = await api.addSweet({
        ...sweetData,
        price: parseFloat(sweetData.price),
        quantity: parseInt(sweetData.quantity)
      });
      const updatedSweets = [...sweets, newSweet];
      setSweets(updatedSweets);
      setFilteredSweets(updatedSweets);
      setShowAddForm(false);
      showNotification('Sweet added successfully!', 'success');
    } catch (error) {
      showNotification('Failed to add sweet: ' + error.message, 'error');
    }
  };

  const handleDeleteSweet = async (id) => {
    try {
      await api.deleteSweet(id);
      const updatedSweets = sweets.filter(sweet => sweet.id !== id);
      setSweets(updatedSweets);
      setFilteredSweets(updatedSweets);
      showNotification('Sweet deleted successfully!', 'success');
    } catch (error) {
      showNotification('Failed to delete sweet: ' + error.message, 'error');
    }
  };

  const handleDeleteByCategory = async (category) => {
    try {
      await api.deleteSweetsByCategory(category);
      const updatedSweets = sweets.filter(sweet => sweet.category !== category);
      setSweets(updatedSweets);
      setFilteredSweets(updatedSweets);
      showNotification(`All sweets in ${category} category deleted!`, 'success');
    } catch (error) {
      showNotification('Failed to delete category: ' + error.message, 'error');
    }
  };

  const handlePurchase = async (id, quantity) => {
    try {
      await api.purchaseSweet(id, quantity);
      const updatedSweets = sweets.map(sweet => {
        if (sweet.id === id) {
          return { ...sweet, quantity: sweet.quantity - quantity };
        }
        return sweet;
      });
      setSweets(updatedSweets);
      setFilteredSweets(updatedSweets);
      showNotification(`Purchased ${quantity} items successfully!`, 'success');
    } catch (error) {
      showNotification('Failed to purchase: ' + error.message, 'error');
    }
  };

  const handleRestock = async (id, quantity) => {
    try {
      await api.restockSweet(id, quantity);
      const updatedSweets = sweets.map(sweet => {
        if (sweet.id === id) {
          return { ...sweet, quantity: sweet.quantity + quantity };
        }
        return sweet;
      });
      setSweets(updatedSweets);
      setFilteredSweets(updatedSweets);
      showNotification(`Restocked ${quantity} items successfully!`, 'success');
    } catch (error) {
      showNotification('Failed to restock: ' + error.message, 'error');
    }
  };

  const handleSearch = async (searchData) => {
    try {
      let results = [];
      
      if (searchData.type === 'name' && searchData.value) {
        results = await api.searchByName(searchData.value);
      } else if (searchData.type === 'category' && searchData.value) {
        results = await api.searchByCategory(searchData.value);
      } else if (searchData.type === 'price' && searchData.min !== '' && searchData.max !== '') {
        results = await api.searchByPriceRange(parseFloat(searchData.min), parseFloat(searchData.max));
      }

      setSearchResults(results);
      setIsSearching(true);
    } catch (error) {
      showNotification('Search failed: ' + error.message, 'error');
    }
  };

  const handleSort = async (ascending) => {
    try {
      setLoading(true);
      const sortedData = await api.sortSweets(ascending);
      setSweets(sortedData);
      setFilteredSweets(sortedData);
      setSortOrder(ascending ? 'asc' : 'desc');
      setIsSearching(false); // Clear search when sorting
      showNotification(`Sorted by price ${ascending ? 'ascending' : 'descending'}`, 'success');
    } catch (error) {
      showNotification('Failed to sort sweets: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearSort = async () => {
    setSortOrder(null);
    await loadSweets(); // Reload original data
  };

  const clearSearch = () => {
    setIsSearching(false);
    setSearchResults([]);
  };

  const displayedSweets = isSearching ? searchResults : filteredSweets;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900 hidden sm:block">Sweet Shop Management</h1>
              <h1 className="text-2xl font-bold text-gray-900 sm:hidden block">SSM</h1>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Add Sweet</span>
            </button>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification.message && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        } text-white`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Panel */}
        <SearchPanel 
          onSearch={handleSearch} 
          onClear={clearSearch} 
          isSearching={isSearching}
          onSort={handleSort}
          onClearSort={clearSort}
          sortOrder={sortOrder}
          availableCategories={[...new Set(sweets.map(sweet => sweet.category))]}
        />

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-sm text-gray-500">Total Sweets</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{sweets.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-sm text-gray-500">Total Stock</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {sweets.reduce((sum, sweet) => sum + sweet.quantity, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-sm text-gray-500">Categories</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {new Set(sweets.map(sweet => sweet.category)).size}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
                <Edit className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-sm text-gray-500">Low Stock</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {sweets.filter(sweet => sweet.quantity < 20).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sweets Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading sweets...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedSweets.map(sweet => (
              <SweetCard
                key={sweet.id}
                sweet={sweet}
                onDelete={handleDeleteSweet}
                onDeleteByCategory={handleDeleteByCategory}
                onPurchase={handlePurchase}
                onRestock={handleRestock}
              />
            ))}
          </div>
        )}

        {displayedSweets.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No sweets found</p>
          </div>
        )}
      </div>

      {/* Add Sweet Modal */}
      <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)}>
        <AddSweetForm 
          onSubmit={handleAddSweet} 
          onCancel={() => setShowAddForm(false)}
          existingCategories={[...new Set(sweets.map(sweet => sweet.category))]}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;