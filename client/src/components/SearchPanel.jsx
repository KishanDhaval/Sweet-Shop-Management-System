import React, { useState } from 'react';
import { Search, X, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const SearchPanel = ({ onSearch, onClear, isSearching, onSort, onClearSort, sortOrder, availableCategories = [] }) => {
  const [searchType, setSearchType] = useState('name');
  const [searchValue, setSearchValue] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchType === 'price') {
      onSearch({ type: 'price', min: priceRange.min, max: priceRange.max });
    } else {
      onSearch({ type: searchType, value: searchValue });
    }
  };

  const handleClear = () => {
    setSearchValue('');
    setPriceRange({ min: '', max: '' });
    onClear();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
        <h2 className="text-lg font-semibold text-gray-900">Search & Sort Sweets</h2>
        <div className="flex items-center space-x-2">
          {/* Sort Controls */}
          <div className="flex items-center space-x-1 border-r border-gray-300 pr-3">
            <button
              onClick={() => onSort(true)}
              className={`p-2 rounded-lg transition-colors ${
                sortOrder === 'asc' 
                  ? 'bg-indigo-100 text-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title="Sort by price ascending"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => onSort(false)}
              className={`p-2 rounded-lg transition-colors ${
                sortOrder === 'desc' 
                  ? 'bg-indigo-100 text-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title="Sort by price descending"
            >
              <ArrowDown className="h-4 w-4" />
            </button>
            {sortOrder && (
              <button
                onClick={onClearSort}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                title="Clear sort"
              >
                <ArrowUpDown className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Clear Search */}
          {isSearching && (
            <button
              onClick={handleClear}
              className="text-gray-500 hover:text-gray-700 flex items-center space-x-2 transition-colors"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Clear Search</span>
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-4 space-y-4 lg:space-y-0">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search by
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
              style={{ paddingRight: '2.5rem' }}
            >
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="price">Price Range</option>
            </select>
          </div>

          {searchType === 'price' ? (
            <div className="flex-2 grid grid-cols-2 gap-2 sm:flex sm:space-x-2 sm:gap-0">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="100.00"
                />
              </div>
            </div>
          ) : (
            <div className="flex-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {searchType === 'name' ? 'Sweet Name' : 'Category'}
              </label>
              {searchType === 'category' ? (
                <select
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
                >
                  <option value="">Select category</option>
                  {availableCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter sweet name..."
                />
              )}
            </div>
          )}

          <div className="flex-shrink-0">
            <label className="hidden lg:block text-sm font-medium text-gray-700 mb-1 opacity-0">
              Search
            </label>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchPanel;