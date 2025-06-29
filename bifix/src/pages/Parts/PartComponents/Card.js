import React from 'react'
import {BsFillBagHeartFill} from "react-icons/bs"
import './Card.css'


function Card({ title, price, brand, category, img, warranty, owner, _id }) {
  // Fix image path if it's a local uploaded file
  const fixedImagePath = img?.startsWith('uploads\\') || img?.startsWith('uploads/')
    ? `http://localhost:5000/${img.replace(/\\/g, '/')}`
    : img;

  return (
    <section className='card' style={{ cursor: "pointer" }}>
      <img className='card-img' src={fixedImagePath} alt={title} />
      <div className='card-details'>
        <h3 className='card-title'>{title}</h3>
        <p className='card-brand'><strong>Brand:</strong> {brand}</p>
        <p className='card-category'><strong>Category:</strong> {category}</p>
        <p className='card-warranty'><strong>Warranty:</strong> {warranty}</p>
        <p className='card-owner'><strong>Seller:</strong> {owner}</p>

        <section className='card-price'>
          <div className='price'>
            <>Rs. {price}</>
          </div>
          <div className='bag'>
            <BsFillBagHeartFill className='bag-icon' />
          </div>
        </section>
      </div>
    </section>
  );
}


export default Card;