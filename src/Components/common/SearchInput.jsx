import React from 'react';
import { useTranslation } from 'react-i18next';

const SearchInput = ({ 
  value, 
  onChange, 
  onSearch, 
  placeholder,
  className = ""
}) => {
  const { t, i18n } = useTranslation();

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
        placeholder={placeholder || t('common:search_placeholder')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        dir={i18n.dir()}
      />
      <button
        className="btn btn-link search-icon-btn "
        onClick={onSearch}
        aria-label={t('common:search_aria_label')}
      >
        <i className="fas fa-search"></i>
      </button>
    </div>
  );
};

export default SearchInput;