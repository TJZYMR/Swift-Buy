import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { Button, ButtonGroup, Form } from 'react-bootstrap'
import Webcam from 'react-webcam';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faIndianRupeeSign, faClipboardList, faCircleUser, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const webcamRef = React.useRef<Webcam>(null);
    const navigate = useNavigate();
    const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
    const [consumerId, setConsumerId] = useState<string>('')
    const [imgArr, setImgArr] = useState<any[]>([]);
    const [formData,setFormData] = useState<any>({
      full_name:'',
      mobile:'',
      email:'',
      aadhar:'',
      address:''

    })
    let counter = 0;
    const [validated, setValidated] = useState(false);
   
    const handleInputChange = useCallback((e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
      // console.log("Formdata", formData);
      
    }, [setFormData, formData]);
  const videoConstraints = {
    width : 320,
    height : 392,
    facingMode: 'user'
  };


  const openCam = useCallback(
    () => {
      console.log(formData)
        setIsCameraOpen(true)
        let tempArr: any = [];
        setTimeout(() => {
            if(webcamRef && webcamRef.current){
                console.log("Test")
        
                for(let i=0;i<50;i++){
                    const imagesrc = webcamRef.current?.getScreenshot();
                    const image = imagesrc?.substring(imagesrc.indexOf(",")+1)
                    tempArr.push(image)
                }
            }
        console.log("tempArr", tempArr)
            setImgArr(tempArr)
            const url = 'http://20.20.1.152:5000/register_fr';
        axios.post(url,{name:formData.full_name ,images: tempArr})
        .then( (response)=> {
          if(response.status === 200 && response.data.success){
          const id = (response?.data?.consumer_id).toString()
          localStorage.setItem('consumer_id', id);
          setConsumerId(id);
          console.log(response.data);
          
          
        //   toast.success("You have sucessfully logged in")
              
          }
        })
        .catch( (error)=> {
          // handle error
        //   toast.error("Something went wrong!")
          console.log(error);
        })
        }, 1000);

        
    },
    [setIsCameraOpen, setImgArr, imgArr, formData.full_name, setConsumerId, consumerId],
  )

  const handleSubmit = (event: any) => {

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  }

  const svgIcon = () => (
    <svg
          width="100%"
          height="100%"
          className="svg"
          viewBox="0 0 165 200"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink">
          <defs>
              <mask id="overlay-mask" x="0" y="0" width="100%" height="100%">
                  <rect x="0" y="0" width="100%" height="100%" fill="#fff"/>
                  <circle cx="50%" cy="50%" r="70" />
              </mask>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" mask="url(#overlay-mask)" fillOpacity="0.7"/>
      </svg>
  );
  
  const handleRegister = useCallback(
    () => {
        console.log("consumerId", consumerId)
      const c_id = localStorage.getItem('consumer_id') || '';
        const url = 'http://20.20.1.152:5000/register';
        const payload:any = {
          consumer_id : c_id,
          consumer_name: formData.full_name,
          consumer_contact: formData.mobile,
          consumer_email: formData.email,
          consumer_aadhar_number: formData.aadhar
        }
        axios.post(url,payload)
        .then( (response)=> {
          // handle success

          if(response.status === 200){
          console.log(response.data);
         navigate('/login', { replace: true })
        //   toast.success("You have sucessfully logged in")
              
          }
        })
        .catch( (error)=> {
          // handle error
        //   toast.error("Something went wrong!")
          console.log(error);
        })
    },
    [imgArr],
  )
  
  
    return (
        <div className='container'>
          {/* <div> */}
           <h2 className='title'>REGISTER</h2>
           <h6 className='register-text'>Enter your informations below to register your account</h6>
           {isCameraOpen ?( <><div className='face-scanner-box'>
            <Webcam
                mirrored
                audio = {false}
                height = {392}
                ref = {webcamRef}
                screenshotFormat = "image/jpeg"
                width = {320}
                videoConstraints = {videoConstraints}
            />
            <div className="overlay-container">
      {svgIcon()}
      </div>
         {/* <button onClick={capture}>Capture photo</button> */}
            </div>
            <Button className='btn-register' onClick={handleRegister}>REGISTER</Button></>) :
           (<div className='register-form'>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="full_name">
                <Form.Control name='full_name' onChange={handleInputChange} type="text" placeholder="Name" required/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="mobile">
                <Form.Control name='mobile' onChange={handleInputChange} type="text" placeholder="Mobile Number" required/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
                  <Form.Control name='email' onChange={handleInputChange} type="email" placeholder="Email Address" required/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="aadhar">
                <Form.Control name='aadhar' onChange={handleInputChange} required type="text" placeholder="Aadhar Card Number" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="address">
                  <Form.Control name='address' onChange={handleInputChange} placeholder='Home Address' as="textarea" rows={3} required/>
              </Form.Group>
            </Form>
            <div onClick={openCam} className='next-btn'>
              <FontAwesomeIcon  color='white' size='2x' className='right-arrow' icon={faArrowRight} />
            </div>
           </div> )}
        </div>
        // </div>
    )
}

export default Register