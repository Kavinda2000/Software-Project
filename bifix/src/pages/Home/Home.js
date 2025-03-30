import React from 'react'
import './Home.css'
import Navbar from '../../components/Navbar/Navbar'
import { Zoom } from "react-awesome-reveal";
import { Fade } from "react-awesome-reveal";
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
        <Navbar />
        <div className="home-background">
        <Fade duration={700}>
            <div className="home-content">
                <h1>Your One-Stop Bike Repair Solution</h1>
                <p>Revolutionizing bike repair with instant parts search, nearby shop locator, and online scheduling.</p>
                <Zoom duration={1000}>
                <div >
                  <Link to={'/Parts'} >
                    <button type="button" >Find Parts</button> 
                    <button type="button">Schedule Repair</button> 
                  </Link>
                </div>
                </Zoom>
            </div>
          </Fade>
        </div>
    </>
  )
}

export default Home