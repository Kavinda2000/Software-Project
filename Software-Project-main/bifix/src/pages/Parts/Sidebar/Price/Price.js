import React from 'react'
import './Price.css'
import Input from '../../PartComponents/input'

function price({handleChange}) {
  return (
    <>
      <div className='sidebar-container'>
        <h2 className='sidebar-title price-title'>
          Price
        </h2>

        <label className='sidebar-label-container'>
            <input onChange={handleChange} type='radio' value="" name='test2'/>
            <span className='checkmark'></span>All
          </label>

        <Input 
        handleChange = {handleChange}
        value= {5000}
        title='Rs.0 - 5000'
        name='test2'
        min={0}
        max={5000}
        />
        <Input 
        handleChange = {handleChange}
        value= {10000}
        title='Rs.5000 - 10000'
        name='test2'
        />
        <Input 
        handleChange = {handleChange}
        value= {20000}
        title='Rs.10000 - 20000'
        name='test2'
        />
        <Input 
        handleChange = {handleChange}
        value= {100000}
        title='Rs.20000 - 100000'
        name='test2'
        />



      </div>
    </>
  )
}

export default price