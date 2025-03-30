import React from 'react'
import './Brand.css'
import Input from '../../PartComponents/input'

function Brand({handleChange}) {
  return (
    <>
    <div className='sidebar-container'>
        <h2 className='sidebar-title brand-title'>
          Brand
        </h2>
        <label className='sidebar-label-container'>
            <input onChange={handleChange} type='radio' value="" name='test3'/>
            <span className='checkmark'></span>All
          </label>
          
          <Input 
        handleChange = {handleChange}
        value= "Honda"
        title='Honda'
        name='test3'
        />
        <Input 
        handleChange = {handleChange}
        value= "Yamaha"
        title='Yamaha'
        name='test3'
        />
        <Input 
        handleChange = {handleChange}
        value= "Bajaj"
        title='Bajaj'
        name='test3'
        />
        <Input 
        handleChange = {handleChange}
        value= "TVS"
        title='TVS'
        name='test3'
        />
        <Input 
        handleChange = {handleChange}
        value= "Hero"
        title='Hero'
        name='test3'
        />
         <Input 
        handleChange = {handleChange}
        value= "other"
        title='Other'
        name='test3'
        />
      </div>
      </>
  )
}

export default Brand