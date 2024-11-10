import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { urlFor, client } from '../client';
import { fetchUser } from '../utils/fetchUser';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [user, setUser] = useState(null);
  const [pinSaved, setPinSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(save?.length || 0);
  const navigate = useNavigate();

  // Fetch user on component mount
  useEffect(() => {
    const fetchedUser = fetchUser();
    setUser(fetchedUser);
    if (fetchedUser) {
      setPinSaved(save?.some((item) => item?.postedBy?._id === fetchedUser.sub));
    }
  }, [save]);

  const savePin = async (id) => {
    if (!pinSaved && user) {
      try {
        await client
          .patch(id)
          .setIfMissing({ save: [] })
          .insert('after', 'save[-1]', [{
            _key: uuidv4(),
            userId: user?.sub,
            postedBy: {
              _type: 'postedBy',
              _ref: user?.sub
            },
          }])
          .commit();

        setPinSaved(true);
        setSaveCount((prevCount) => prevCount + 1);
        toast.success('Pin was successfully saved!');
      } catch (error) {
        toast.error('Failed to save the pin. Please try again.');
      }
    }
  };

  const deletePin = async (id) => {
    try {
      await client.delete(id);
      toast.success('Pin was successfully deleted!');
      navigate('/'); 
    } catch (error) {
      toast.error('Failed to delete the pin. Please try again.');
    }
  };

  // Show loading until `user` is initialized
  if (!user) return <div>Loading...</div>;

  return (
    <div className='m-2'>
      <div 
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
      >
        {image && (
          <img className='rounded-lg w-full' alt='user-post' src={urlFor(image).width(250).url()} />
        )}
        {postHovered && (
          <div
            className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'
            style={{ height: '100%' }}
          >
            <div className='flex items-center justify-between'>
              <div className='flex gap-2'>
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className='bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {pinSaved ? (
                <button type='button' className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'>
                  {saveCount} Saved
                </button>
              ) : (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  type='button'
                  className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                >
                  Save
                </button>
              )}
            </div>
            <div className='flex justify-between items-center gap-2 w-full'>
              {destination && (
                <a
                  href={destination}
                  target='_blank'
                  rel='noreferrer'
                  className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:100 hover:shadow-md'
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 13 ? `${destination.slice(8, 20)}...` : destination}
                </a>
              )}
              {postedBy?._id === user?.sub && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  className='bg-white p-2 opacity-70 hover:opacity-100 font-bold text-dark px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {postedBy?.userName && (
        <Link to={`user-profile/${postedBy?._id}`} className='flex gap-2 mt-2 items-center'>
          <img
            className='w-8 h-8 rounded-full object-cover'
            src={postedBy?.image}
            alt='user-profile'
          />
          <p className='font-semibold capitalize'>{postedBy?.userName}</p>
        </Link>
      )}
    </div>
  );
}

export default Pin;
