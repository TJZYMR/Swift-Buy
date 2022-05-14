import axios from 'axios';
import React, { useCallback, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Webcam from 'react-webcam';

const Login: React.FC = () => {
    const webcamRef = React.useRef<Webcam>(null);
    let counter = 0;
    const navigate = useNavigate();
  const videoConstraints = {
    width : 320,
    height : 392,
    facingMode: 'user'
  };
 
  const capture = useCallback(()=>{
    if(webcamRef && webcamRef.current){
            const imagesrc = webcamRef.current.getScreenshot();
            console.log(imagesrc)
    }
    // const looper = setInterval(()=>{ 
    //     counter++;
    //     let imageArr: any = [];
    //     console.log("Counter is: " + counter);
    //     if(webcamRef && webcamRef.current){
    //     const imagesrc = webcamRef.current.getScreenshot();
    //     for (let i = 0; i < 5; i++) {
    //          imageArr.push(imagesrc);
    //         console.log(imageArr[i]);
    //     }
    //     }
    //     if (counter >= 5)
    //     {
    //         clearInterval(looper);
    //     }
    // console.log("Array:",imageArr)
    // }, 200);
    
  },[webcamRef])

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
  useEffect(()=>{
    setTimeout(() => {
        if(webcamRef && webcamRef.current){
            const imagesrc = webcamRef.current.getScreenshot();
            // console.log(imagesrc?.toString())
            const login_image = imagesrc?.substring(imagesrc.indexOf(",")+1)
            console.log("login_image",login_image)
            const url = 'http://20.20.1.152:5000/login_fr';
            axios.post(url,{file:login_image})
            .then( (response)=> {
              // handle success

              if(response.status === 200 && response.data.success){
              console.log(response.data);
              navigate('/home', { replace: true })
              toast.success("You have sucessfully logged in")
                  
              }
            })
            .catch( (error)=> {
              // handle error
              toast.error("Something went wrong!")
              console.log(error);
            })
        }
    }, 1000);  
  },[webcamRef])

  return (
        <div className='container'>
           <h2 className='title'>LOGIN</h2>
            <span className='scan-text'>Scan to login</span>
            <div className='face-scanner-box'>
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
            <span className='or-label'>OR</span>
            <Link to={'/register'}><Button className='btn-register' >REGISTER</Button></Link>
        </div>
    )
}

export default Login