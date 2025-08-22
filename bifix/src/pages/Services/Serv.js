import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Serv.css';

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
        <Link to="/Services/BikeRepairSchedule">
          <button className='service-btn' onClick={() => navigate('/Services/BikeRepairSchedule')}>
              Schedule Now
          </button>
        </Link>   
        </div>

        {/* Online Payments */}
        <div className='service-card'>
          <h2 className='services-title'>Bike Service</h2>
          <p className='services-paragraph'>Schedule a visit to trusted service centers for smooth and reliable maintenance.</p>
          <Link to="/Services/BikeServiceSchedule">
            <button className='service-btn' onClick={() => navigate('/Services/BikeServiceSchedule')}>
              Schedule Now
            </button>
        </Link>
          
          
        </div>
        <div style={{ marginTop: 20, width: '100%' }}>
          <button
            className='service-btn'
            onClick={() => navigate('/Services/BikeServiceMap')}
          >
            Find centers near me
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

export default Services;