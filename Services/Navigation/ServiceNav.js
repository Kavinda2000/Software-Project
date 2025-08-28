import React from 'react';
import './ServiceNav.css';
import { FaSearch } from 'react-icons/fa';

function ServiceNav({ query, setQuery }) {
  return (
    <div className="service-nav-wrapper">
      <form className="service-nav-searchbox" autoComplete="off" onSubmit={e => e.preventDefault()}>
        <input
          type="text"
          className="service-nav-input"
          placeholder="Search Shops"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <div className="service-nav-search-label">
          SEARCH <FaSearch className="service-nav-icon" />
        </div>
      </form>
    </div>
  );
}

export default ServiceNav;