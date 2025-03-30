import React from 'react';
import './Nav.css';
import { FiHeart } from "react-icons/fi";
import { AiOutlineShoppingCart, AiOutlineUserAdd } from "react-icons/ai";
import { Link } from 'react-router-dom';

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
          <a href='#'><FiHeart className='nav-icons' /></a>
          <a href='#'><AiOutlineShoppingCart className='nav-icons' /></a>
          <a><Link to="/login"><AiOutlineUserAdd className='nav-icons' /></Link></a>
          
        </div>
      </div>
    </div>
  );
}

export default Nav;
