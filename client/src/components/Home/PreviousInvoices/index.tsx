import axios from 'axios';
import React, { useEffect } from 'react'

const PreviousInvoices: React.FC = () => {

    useEffect(() => {
        const c_id = localStorage.getItem('consumer_id') || '';
        axios.get(`http://20.20.1.152:5000/get-invoice-details?consumer_id=2`)
        .then((response) => {
          // handle success
          if(response.status === 200){
           console.log(response.data)
        //    setInfo(response?.data?.user_info ?? {})
          }
          console.log(response);
        })
        .catch((error) => {
          // handle error
          console.log(error);
          })
    
     
    }, [])
    return (
        <div className='container'>
            <h2 className='title'>INVOICES</h2>
        </div>
    )
}

export default PreviousInvoices