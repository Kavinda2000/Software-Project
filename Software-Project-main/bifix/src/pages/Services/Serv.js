import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Serv.css';

function Services() {
  const navigate = useNavigate();

  return (
    <>
      <div className='service-page'>
        <p className='main-description'>Professional bike repair and maintenance services at your fingertips. Trust our network of certified mechanics for reliable, quality service.</p>

        <div className='services-container'>
          {/* Bike Repair Service */}
          <div className='service-card'>
            <h2 className='services-title'>🚧 Bike Repair</h2>
            <p className='services-paragraph'>Expert repairs for all bike issues. From minor fixes to major overhauls, our certified mechanics ensure your bike runs smoothly and safely.</p>
            <Link to="/Services/BikeRepairSchedule">
              <button className='service-btn' onClick={() => navigate('/Services/BikeRepairSchedule')}>
                🔧 Schedule Repair
              </button>
            </Link>
          </div>

          {/* Bike Service */}
          <div className='service-card'>
            <h2 className='services-title'>🔧 Bike Service</h2>
            <p className='services-paragraph'>Regular maintenance and tune-ups to keep your bike in peak condition. Preventive care saves money and extends your bike's life.</p>
            <Link to="/Services/BikeServiceSchedule">
              <button className='service-btn' onClick={() => navigate('/Services/BikeServiceSchedule')}>
                ⚙️ Schedule Service
              </button>
            </Link>
          </div>

          {/* Find Centers */}
          <div style={{ marginTop: 20, width: '100%' }}>
            <button
              className='service-btn find-centers-btn'
              onClick={() => navigate('/Services/BikeServiceMap')}
            >
              📍 Find Service Centers Near Me
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Services;