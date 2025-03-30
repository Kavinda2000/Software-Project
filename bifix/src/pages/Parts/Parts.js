import React, { useState } from 'react'
import Nav from './Navigation/Nav';
import './Parts.css'
import Sidebar from './Sidebar/Sidebar';
import Card from './PartComponents/Card'
import product from './PartList'


function Parts() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const[query,setQuery] = useState("")

//input Filter
  
const handleInputChange = (event) => {
    setQuery(event.target.value)
};

const filteredItems = product.filter((product) => 
  product.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  


//Radio Filter
const handleChange = (event) => {
  setSelectedCategory(event.target.value)
}

function filteredData(product, selected, query){
  let filteredProducts= product

  //filtering input items
  if(query){
    filteredProducts = filteredItems
  }

  //selected filter
  if(selected){
    filteredProducts = filteredProducts.filter(({category,pprice,Brand})=> category === selected || pprice === selected || Brand === selected)
  }

  return filteredProducts.map(({img, pprice, title, star, reviews, warranty, PartId}) => (
    <Card 
    key={PartId}
    img={img}
    title={title}
    star={star}
    pprice={pprice}
    reviews={reviews}
    warranty={warranty}
    PartId={PartId}
    />
  ))
}


const result = filteredData(product, selectedCategory, query)


  return (
    <>
        <Nav query={query} handleInputChange={handleInputChange}/>
        <Sidebar handleChange={handleChange}/>
        <section className='card-container'>
         {result} 
        </section>
    </>
  )
}

export default Parts