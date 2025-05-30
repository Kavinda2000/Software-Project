import React from 'react'
import './Sidebar.css'
import Category from './Category/Category'


function Sidebar({handleChange}) {


  return (
    <>
        <section className='parts-sidebar'>
            <div className='logo-container'>
                <h1>🛒</h1>
            </div>
        <Category  handleChange={handleChange}/>

        </section>
    </>
  )
}

export default Sidebar