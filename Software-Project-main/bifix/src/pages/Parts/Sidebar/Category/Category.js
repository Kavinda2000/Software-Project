import React from 'react'
import './Category.css'
import Input from '../../PartComponents/input'

function category({handleChange}) {
  return (
    <>
      <div className='sidebar-container'>
        <h2 className='sidebar-title'>
          Category
        </h2>
        <div>
          <label className='sidebar-label-container'>
            <input onChange={handleChange} type='radio' value="" name='test'/>
            <span className='checkmark'></span>All
          </label>

        <Input 
        handleChange = {handleChange}
        value= "Tires"
        title='Tires'
        name='test'
        />
        <Input 
        handleChange = {handleChange}
        value= "Brake Pads"
        title='Brake Pads'
        name='test'
        />
        <Input 
        handleChange = {handleChange}
        value= "Chain"
        title='Chain'
        name='test'
        />
        <Input 
        handleChange = {handleChange}
        value= "Battery"
        title='Battery'
        name='test'
        />
        <Input 
        handleChange = {handleChange}
        value= "Oil"
        title='Oil'
        name='test'
        />


        </div>
      </div>
    </>
  )
}

export default category