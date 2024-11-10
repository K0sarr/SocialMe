import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // Use context to login
import shareVideo from '../assets/share.mp4';
import logo from '../assets/LogoSWhite2.png';
import { client } from '../client';

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useUser(); // Access loginUser function from context

  const handleLogin = async (response) => {
    const { credential } = response;
    const decodedResponse = JSON.parse(atob(credential.split('.')[1]));
    const { sub, name, picture } = decodedResponse;
    
    const query = `*[_type == "user" && _id == "${sub}"]`;
    const existingUser = await client.fetch(query);

    if (existingUser.length === 0) {
      const newUser = {
        _id: sub,
        _type: 'user',
        userName: name,
        image: picture,
      };
      await client.create(newUser);
    }


    loginUser({ sub, name, picture });
    navigate('/');
  };

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
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="130px" alt="logo" />
          </div>
          <div className="shadow-2xl">
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}>
              <GoogleLogin onSuccess={handleLogin} cookiePolicy="single_host_origin" />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
