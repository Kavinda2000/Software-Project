import React from 'react'
import {BsFillBagHeartFill} from "react-icons/bs"
import { useNavigate } from "react-router-dom";


function Card({img, title, star, pprice, PartId}) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/Parts/${PartId}`);
  };

  return (
    <section className='card' onClick={handleClick} style={{ cursor: "pointer" }}>
                <img className='card-img' src={img} alt={title}/>
                <div className='card-details'>
                  <h3 className='card-title'>{title}</h3>
                  <section className='card-review'>
                    {star} {star} {star} {star} 

                    <span className='total-reviews'>4</span>
                  </section>
                  <section className='card-price'>
                    <div className='price'>
                      <a>Rs. {pprice}</a>
                    </div>
                    <div className='bag'>
                      <BsFillBagHeartFill className='bag-icon'/>
                    </div>
                  </section>
                </div>
              </section>
  )
}

export default Card