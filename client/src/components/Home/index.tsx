import { faCircleUser, faClipboardList, faIndianRupeeSign, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();
    return (
      <div className='container'>
       <h2 className='title'>INFO</h2>
       <FontAwesomeIcon style={{float:"right"}} onClick={() => navigate('/login')}  color='#454545' size='2x' className='right-arrow' icon={faSignOutAlt} />
       <div className='card-box'>
           <div className='info-card' onClick={()=> navigate('/payment-details')}>
              <div className='test'>
              <FontAwesomeIcon color='white' size='1x' className='right-arrow'   icon={faIndianRupeeSign} />
              </div>
                <div className='card-text'>PAYMENT DETAILS</div>
           </div>
           <div className='info-card' onClick={()=> navigate('/barcode-scan')}>
           <div className='test'>
              <FontAwesomeIcon color='white' size='1x' className='right-arrow'   icon={faClipboardList} />
              </div>
           <div className='card-text' >BUY ITEMS</div>
           </div>
           <div className='info-card' onClick={()=> navigate('/user-details')}>
           <div className='test'>
              <FontAwesomeIcon color='white' size='1x' className='right-arrow'   icon={faCircleUser} />
              </div>
           <div className='card-text'>USER PROFILE DETAILS</div>
           </div>
       </div>
       {/* <div className='card-box1'>
           <span className='card-text'>PAYMENT DETAILS</span>
       </div>
       <div className='card-box2'></div>
       <div className='card-box3'></div> */}

      </div>
    );
  }
  
  export default Home;