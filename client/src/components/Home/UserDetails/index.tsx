import { faArrowLeft, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const UserDetails: React.FC = () => {
    const navigate = useNavigate();
    const [info, setInfo] = useState<any>({});
    useEffect(() => {
        const c_id = localStorage.getItem('consumer_id') || '';
        axios.get(`http://20.20.1.152:5000/get-profile-details?consumer_id=${c_id}`)
        .then((response) => {
          // handle success
          if(response.status === 200){
           console.log(response.data.user_info)
           setInfo(response?.data?.user_info ?? {})
          }
          console.log(response);
        })
        .catch((error) => {
          // handle error
          console.log(error);
          })
    
     
    }, [setInfo])
    
    return (
        <div className='container'>
            <h2 className='title'>USER DETAILS</h2>
            <FontAwesomeIcon style={{float:"left"}} onClick={() => navigate('/home')}  color='#454545' size='1x' className='right-arrow' icon={faArrowLeft} />
       <FontAwesomeIcon style={{float:"right"}} onClick={() => navigate('/login')}  color='#454545' size='1x' className='right-arrow' icon={faSignOutAlt} />
       
            <div className='register-form'>
            <Form noValidate >
              <Form.Group className="mb-3" controlId="name">
                <Form.Control name='name' value={info.consumer_name} readOnly  type="text" placeholder="Name" required/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="mobile">
                <Form.Control name='mobile' value={info.consumer_contact} readOnly  type="text" placeholder="Mobile Number" required/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
                  <Form.Control name='email' value={info.consumer_email} readOnly  type="email" placeholder="Email Address" required/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="aadhar">
                <Form.Control name='aadhar' value={info.consumer_aadhar_number} readOnly  required type="text" placeholder="Aadhar Card Number" />
              </Form.Group>
              {/* <Form.Group className="mb-3" controlId="address">
                  <Form.Control name='address' readOnly  placeholder='Home Address' as="textarea" rows={3} required/>
              </Form.Group> */}
            </Form>
           </div> 
        </div>
    )
}

export default UserDetails