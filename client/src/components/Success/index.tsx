import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const Success: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className='container'>
            <FontAwesomeIcon color="green" style={{marginTop:"50%"}} icon={faCheck} size='5x' />
            <div style={{fontSize:"24px"}}>Transaction Successful.</div>
       <Button style={{marginTop:"25px"}} onClick={()=> navigate('/login')}>Back to Login</Button>
        </div>
    )
}

export default Success