import './Sidebar.css'
import Category from './Category/Category'
import'./Sidebar.css'


function Sidebar({handleChange}) {


  return (
    <>
        <section className='parts-sidebar'>
        <Category  handleChange={handleChange}/>
        </section>
    </>
  )
}

export default Sidebar