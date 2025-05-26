import React from 'react';

const SearchInput = ({ 
  value, 
  onChange, 
  onSearch, 
  placeholder = "Search...",
  className = ""
}) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className={`search-container ${className}`}>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button
        className="btn btn-link search-icon-btn"
        onClick={onSearch}
        aria-label="Search"
      >
        <i className="fas fa-search"></i>
      </button>
    </div>
  );
};

export default SearchInput;