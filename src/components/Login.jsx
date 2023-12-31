import React from 'react'
// import GoogleLogin from 'react-google-login'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin, googleLogout } from '@react-oauth/google'
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom'
import shareVideo from '../assets/share.mp4'
import logo from '../assets/LogoSWhite2.png'

import {client} from '../client'


const Login = () => {

    // const responseGoogle = (response) => {
    //     console.log(response);
    //   }
    const navigate = useNavigate();

    const responseGoogle = (response) => {
      const decode = jwt_decode(response.credential);
      console.log(decode);
        // if (!response.profileObj) return;
        // localStorage.setItem('user', JSON.stringify(response.profileObj))

        localStorage.setItem('user', JSON.stringify(decode));

        // const { name, googleId, imageUrl } = response.profileObj;
        const { name, aud, picture } = decode;
        // const { name, sub, imageUrl } = decode;

        const doc = {
          _id: aud, 
          _type: 'user',
          userName: name,
          image: picture,
        }

        // const doc = {
        //     _id: sub,
        //     _type: 'user',
        //     userName: name,
        //     image: imageUrl,
        // }

        console.log("googleId:", aud);
        console.log("image:", picture);



        client.createIfNotExists(doc)
        .then(() => {
            navigate('/', {replace: true})
        })
    }

  return (
    <div className="flex justiy-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
            src={shareVideo}
            type="video/mp4"
            loop
            controls={false}
            muted
            autoPlay
            className='w-full h-full object-cover'
        />

        <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
        <div className="p-5">
        <img src={logo} width="130px" alt="logo" />
        </div>

        <div className='shadow-2xl'>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}>
          <GoogleLogin
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy="single_host_origin"
          />
        </GoogleOAuthProvider>


            {/* <GoogleOAuthProvider
             clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}>
              <GoogleLogin
             render={(renderProps) => (
                <button
                type="button"
                className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                >
                    <FcGoogle className="mr-4"/> Sign in with Google

                </button>

             )}
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy="single_host_origin"
            
            />;
            </GoogleOAuthProvider>; */}
            


        </div>

        </div>
      </div>
    </div>
  )
}

export default Login
