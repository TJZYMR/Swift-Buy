import { faArrowLeft, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import React, { useCallback, useState } from 'react'
import {  Form, Accordion } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'


const PaymentDetails: React.FC = () => {
  const [walletAmount, setWalletAmount] = useState<string>('')
  const [addedAmount, setAddedAmount] = useState<string>('')
  const navigate = useNavigate();
const getWalletDetails =  useCallback(
  () => {
    const c_id = localStorage.getItem('consumer_id') || '';
    axios.get(`http://20.20.1.152:5000/get-wallet?consumer_id=${c_id}`)
  .then((response) => {
    // handle success
    if(response.status === 200){
      setWalletAmount(response?.data?.wallet_amount)
    }
    console.log(response);
  })
  .catch((error) => {
    // handle error
    console.log(error);
    })
  },
  [setWalletAmount],
)

const addAmount =  useCallback(
  () => {
    axios.post(`http://20.20.1.152:5000/add-money-wallet?consumer_id=1&amount=${addedAmount}`)
  .then((response) => {
    // handle success
    if(response.status === 200){
      toast.success("Amount successfully added into your wallet")
      setWalletAmount(response?.data?.total_wallet_amount)
      setAddedAmount('')
    }
    console.log(response);
  })
  .catch((error) => {
    // handle error
    console.log(error);
    })
  },
  [setWalletAmount, addedAmount, setAddedAmount],
)


    return (
      
      <div className='container'>
       <FontAwesomeIcon style={{float:"left"}} onClick={() => navigate('/home')}  color='#454545' size='1x' className='right-arrow' icon={faArrowLeft} />
       <FontAwesomeIcon style={{float:"right"}} onClick={() => navigate('/login')}  color='#454545' size='1x' className='right-arrow' icon={faSignOutAlt} />
       
         <h2 className='title'>PAYMENT DETAILS</h2>
         {/* <div style={{paddingTop : '20px'}} className='payment-text'>PAMENT DETAILS</div> */}
<Accordion style={{paddingTop : '45%'}}>
  <Accordion.Item eventKey="0">
    <Accordion.Header><span className='bank-details-card-test'> BANK DETAILS </span></Accordion.Header>
    <Accordion.Body>
    <Form.Group className="mb-3" controlId="acc_holder" style={{paddingTop : '10px'}}>
      <Form.Control type="text" placeholder="Account Holder" required/>
    </Form.Group>
    <Form.Group className="mb-3" controlId="acc_number">
      <Form.Control type="number" placeholder="Account Number" required/>
    </Form.Group>
    <Form.Group className="mb-3" controlId="acc_ifsc">
        <Form.Control type="number" placeholder="IFSC code" required/>
    </Form.Group>
    <Form.Group className="mb-3" controlId="acc_adhar_card_number">
      <Form.Control required type="text" placeholder="Aadhar Card Number" />
    </Form.Group>
    <Form.Group className="mb-3" controlId="acc_home_add">
        <Form.Control placeholder='Home Address' as="textarea" rows={3} required/>
    </Form.Group>
    <div className='add-bank'> + ADD BANK</div>
    </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="1" style={{marginTop : '15px'}}>
<Accordion.Header><span className='bank-details-card-test' style={{paddingLeft:"145px"}}> UPI </span></Accordion.Header>
    <Accordion.Body>
    </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="2" style={{marginTop : '15px'}}>
<Accordion.Header><span className='bank-details-card-test' style={{paddingLeft:"50px"}}> CREDIT CARD / DEBIT CARD </span></Accordion.Header>
    <Accordion.Body>
    </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="3" style={{marginTop : '15px'}}>
<Accordion.Header><span className='bank-details-card-test' > NET BANKING </span></Accordion.Header>
    <Accordion.Body>
    </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="4" style={{marginTop : '15px'}}>
<Accordion.Header onClick={getWalletDetails}><span className='bank-details-card-test' style={{paddingLeft:"120px"}}> WALLET </span></Accordion.Header>
    <Accordion.Body>
      <span>Available Amount: {walletAmount}</span>
    <Form.Group className="mb-3" controlId="amount">
      <Form.Control type="number" value={addedAmount} onChange={(e)=> setAddedAmount(e.target.value)} placeholder="Enter amount" required/>
    </Form.Group>
    <div className='add-bank' onClick={addAmount}> + ADD </div>
    </Accordion.Body>
  </Accordion.Item>
</Accordion>

        {/* <h2 className='title'>PAMENT DETAILS</h2> */}
        {/* <div className='card-box'>
          <div className='bank-details-card'>
            <div className='bank-details-card-text'>BANK DETAILS</div>
          </div>
          <div className='bank-details-card' style={{marginTop : '10px'}}>
            <div className='bank-details-card-text'>UPI</div>
          </div>
          <div className='bank-details-card' style={{marginTop : '10px'}}>
            <div className='bank-details-card-text'>CREDIT CARD / DEBIT CARD</div>
          </div>
          <div className='bank-details-card' style={{marginTop : '10px'}}>
            <div className='bank-details-card-text'>NET BANKING</div>
          </div>
          <div className='bank-details-card' style={{marginTop : '10px'}}>
            <div className='bank-details-card-text'>WALLET</div>
          </div> */}
          
           {/* <div style={{paddingTop : '50px'}}> */}
             {/* <div className='bank-details-button'> <div className='bank-details-text'>BANK DETAILS </div> </div> */}
       {/* <Form.Group className="mb-3" controlId="acc_holder" style={{paddingTop : '10px'}}>
      <Form.Control type="text" placeholder="Account Holder" required/>
    </Form.Group>
    <Form.Group className="mb-3" controlId="acc_number">
      <Form.Control type="number" placeholder="Account Number" required/>
    </Form.Group>
    <Form.Group className="mb-3" controlId="acc_ifsc">
        <Form.Control type="number" placeholder="IFSC code" required/>
    </Form.Group>
    <Form.Group className="mb-3" controlId="acc_adhar_card_number">
      <Form.Control required type="text" placeholder="Aadhar Card Number" />
    </Form.Group>
    <Form.Group className="mb-3" controlId="acc_home_add">
        <Form.Control placeholder='Home Address' as="textarea" rows={3} required/>
    </Form.Group>
    <div className='add-bank'> + ADD BANK</div> */}
    
      {/* </div> */}
       {/* </div> */}
    
      </div>
    );
  }
  
  export default PaymentDetails;