import React from 'react'
import './Sidebar.css'
import Category from './Category/Category'
import Price from './Price/Price'
import Brand from './Brand/Brand'

function Sidebar({handleChange}) {


  return (
    <>
        <section className='sidebar'>
            <div className='logo-container'>
                <h1>🛒</h1>
            </div>
        <Category  handleChange={handleChange}/>

        </section>
    </>
  )
}

export default Sidebar