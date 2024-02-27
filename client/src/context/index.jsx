import { createContext, useEffect, useReducer, useState } from "react"
import PageLoader from "../components/PageLoader";
import { SIGNIN_FAILED, SIGNIN_SUCCESS, SIGNUP_EVENT } from "../consts";
import { IS_AUTHENTICATED } from "../pages/routes";
import useAxios, { GET } from "../hooks/useAxios";

const initialValue = {
    signedIn: false,
    requireVerification: false,
    user: null
};

export const Session = createContext({ state: initialValue });

export const Security = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialValue);
    const [complete, setComplete] = useState(false);
    const { call } = useAxios(IS_AUTHENTICATED, GET, { withProgressBar: true });

    function reducer(state, { action, user }) {
        switch (action) {
            case SIGNIN_SUCCESS:
                return { 
                    signedIn: true, 
                    requireVerification: false,
                    user: user 
                };
            case SIGNIN_FAILED:
                return { 
                    signedIn: false, 
                    requireVerification: false,
                    user: null 
                };
            case SIGNUP_EVENT:
                return {
                    signedIn: false,
                    requireVerification: true,
                    user: null
                }
            default:
                return state;
        }
    }

    useEffect(() => {
        async function auth(){
            try {
                const res = await call(); 
                const { user } = res.data;
                user && dispatch({ action: SIGNIN_SUCCESS, user: user })
            } catch (error) {
                dispatch({ action: SIGNIN_FAILED })
            } finally {
                setComplete(true);
            }
        }
        
        // check user if authenticated
        auth();
    }, [])

    return (  
        <Session.Provider value={{ state, dispatch }}>{complete ? children : <PageLoader />}</Session.Provider> 
    )
}