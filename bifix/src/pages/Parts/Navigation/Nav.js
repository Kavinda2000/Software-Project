import React from 'react';
import './Nav.css';
import { FaSearch } from 'react-icons/fa';

function Navbar({ query, setQuery }) {
  const handleChange = (e) => {
    setQuery(e.target.value); // Live update
  };

  return (
    <div className="nav-wrapper">
      <form className="nav-searchbox" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          className="nav-input"
          placeholder="Search motorbike parts..."
          value={query}
          onChange={handleChange}
        />
        <div className="nav-search-label">
          SEARCH <FaSearch className="nav-icon" />
        </div>
      </form>
    </div>
  );
}

export default Navbar;
