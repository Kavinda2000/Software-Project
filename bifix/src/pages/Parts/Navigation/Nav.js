import React from 'react';
import './Nav.css';
import { FaSearch } from "react-icons/fa";

function Nav({ handleInputChange, query }) {
  return (
    <div className='nav-wrapper'>
      <div className='nav-container'>
        <input
          type="text"
          className='search-input'
          onChange={handleInputChange}
          value={query}
          placeholder='Enter your search'
        />
        <div className='icon-container'>
          <button className="icon-button">
            <FaSearch className='nav-icons' />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Nav;
