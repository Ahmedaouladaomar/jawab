import React, { useContext, useEffect } from 'react'
import { Session } from '../context'
import { useNavigate } from 'react-router-dom';
import { LOGIN } from '../pages/routes';

const Guard = ({ children }) => {
    const navigate = useNavigate();
    const { state } = useContext(Session);
    const { signedIn } = state;
    
    useEffect(() => {
        !signedIn && navigate(LOGIN);
    },[])

  return (
    <>  
        { signedIn && children }
    </>
  )
}

export default Guard;
