import { useState } from 'react';
import { client } from '../axios';
import { nprogress } from '@mantine/nprogress';
import { notifications } from '@mantine/notifications';

export const POST = 'post';
export const PATCH = 'patch';
export const PUT = 'put';
export const GET = 'get';
export const DELETE = 'delete';

export const SUCCESS_COLOR = 'green';
export const OPERATION_SUCCESSFUL = 'Operation successful';

export const ERROR_COLOR = 'red';
export const OPERATION_FAILED = 'Operation failed';

const useAxios = (url, method, { withProgressBar, withNotification } = {}) => {
    const [response, setResponse] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState();

    async function _call(newPath = null, newMethod = null, body) {
        url = newPath ? newPath : url;
        method = newMethod ? newMethod : method;
        if(method && [POST, PATCH, PUT, GET, DELETE].includes(method)){
            return client[method](url, body);
        }
        throw new Error(`The ${method} method is not supported`);
    }

    const call = async function ({ newPath, newMethod, body  } = {}) {
        let errorCatch = false;
        try {
            withProgressBar && nprogress.start();
            setLoading(true);
            let response = await _call(newPath, newMethod, body);
            setResponse(response);
            return response;
        } catch (error) {
            setError(error);
            errorCatch = true;
        } finally {
            withNotification &&
            notifications.show({
                message: errorCatch ? OPERATION_FAILED : OPERATION_SUCCESSFUL,
                color: errorCatch ? ERROR_COLOR : SUCCESS_COLOR   
            });
            withProgressBar && nprogress.complete();
            setLoading(false);
        }
    }

    return { response, error, loading, call };
};

export default useAxios;