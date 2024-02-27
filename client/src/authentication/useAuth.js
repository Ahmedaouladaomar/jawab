import useAxios, { GET, POST } from '../hooks/useAxios';
import { LOGIN, LOGOUT, REGISTER, VERIFICATION } from '../pages/routes';
import { useContext, useState } from "react";
import { Session } from "../context";
import { SIGNIN_FAILED, SIGNIN_SUCCESS, SIGNUP_EVENT } from "../consts";
import { useNavigate } from 'react-router-dom';

const useAuth = ({ withProgressBar, withNotification } = {}) => {
    const navigate = useNavigate();
    const { loading, call } = useAxios(LOGIN, POST, { withProgressBar, withNotification });
    const [response, setResponse] = useState(false);
    const [success, setSuccess] = useState(false);
    const [fail, setFail] = useState(false);
    const { dispatch } = useContext(Session);

    const signIn = async (body) => {
        let response = await call({ body });
        // check if user neeeds to verify account
        if(response && response.status == 201){
            if(response.data.requireVerification){
                dispatch({ action: SIGNUP_EVENT });
                navigate(VERIFICATION.replace(':id', response.data.id));
                return;
            }
            let { user } = response.data;
            dispatch({ action: SIGNIN_SUCCESS, user: user });
            setSuccess(true);
        } else {
            setFail(true);
        }
    }

    const signUp = async (body) => {
        let response = await call({ newPath: REGISTER, body: body });
        // dispatch signup event
        if(response && response.status == 201){
            dispatch({ action: SIGNUP_EVENT });
            setResponse(response);
            setSuccess(true);
            navigate(VERIFICATION.replace(':id', response.data.user.id));
        } else {
            setFail(true);
        }
    }
    
    const signOut = async () => {
        // sign out user
        let newPath = LOGOUT;
        let newMethod = GET;
        await call({ newPath, newMethod });
        dispatch({ action: SIGNIN_FAILED });
        navigate(LOGIN);
    }

    return { loading, signIn, signUp, signOut, success, fail, response };
}

export default useAuth;