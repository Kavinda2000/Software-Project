import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Services.css';

function Services() {
  const navigate = useNavigate();

  return (
    <>
    <div className='service-page'>
      <h1 className='head'>Our Services</h1>

      <div className='services-container'>
        {/* Online Service Scheduling */}
        <div className='service-card'>
          <h2 className='services-title'>Bike repair</h2>
          <p className='services-paragraph'>Book an appointment with trusted repair centers for hassle-free servicing.</p>
        <Link to="/Services/BikeRepair">
            <button className='service-btn' onClick={() => navigate('/Services/BikeRepair')}>
              Schedule Now
          </button>
        </Link>

        
          
        </div>

        {/* Online Payments */}
        <div className='service-card'>
          <h2 className='services-title'>Bike Service</h2>
          <p className='services-paragraph'>Schedule a visit to trusted service centers for smooth and reliable maintenance.</p>
          <Link to="/Services/BikeService">
            <button className='service-btn' onClick={() => navigate('/Services/BikeServiceBooking')}>
              Schedule Now
            </button>
        </Link>
          
          
        </div>
      </div>
    </div>
    </>
  );
}

export default Services;