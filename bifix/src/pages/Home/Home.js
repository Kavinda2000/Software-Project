import React, { useEffect, useRef, useState } from 'react';
import './Home.css';
import { Zoom, Fade } from "react-awesome-reveal";
import { Link } from 'react-router-dom';

function Home() {
  const videoRef = useRef(null);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const timeLeft = video.duration - video.currentTime;

      if (timeLeft < 1) {
        setFadeOut(true);
      } else {
        setFadeOut(false);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);


  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="background-video"
      >
        <source src="/bike.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="home-background">
        <div className={`video-fade-overlay ${fadeOut ? 'fade-in' : ''}`}></div>

        <Fade duration={700}>
          <div className="home-content">
            <h1>Your One-Stop Bike Repair Solution</h1>
            <p>Revolutionizing bike repair with instant parts search, nearby shop locator, and online scheduling.</p>
            <Zoom duration={1000}>
              <div>
                <Link to="/Parts">
                  <button type="button"><span className='home-span'>Find Parts</span></button>
                </Link>
                <Link to="/Services">
                  <button type="button"><span className='home-span'>Schedule Repair</span></button>
                </Link>
                  
              </div>
            </Zoom>

            {/* Down arrow button */}
            <div className="intellectii-arrows">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="arrow">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

          </div>
        </Fade>
      </div>

      <section id="about-section" className="about-section">
        <div className="about-grid">
          <div className="about-video">
            <video autoPlay loop muted playsInline>
              <source src="/cup.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="about-text">
            <h2>About Us</h2>
            <p>
              We are passionate about bringing modern technology into the world of bike maintenance.
              Whether you're a professional rider or a daily commuter, our platform connects you to the best parts and services.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
