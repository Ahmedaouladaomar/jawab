import { useEffect, useState } from 'react';
import { Flex } from '@mantine/core';
import useAxios, { GET } from '../../../hooks/useAxios';
import { THREADS } from '../../../pages/routes';
import AddThread from '../Add';
import ViewThread from '../View';


function ListThreads() {
    const [update, setUpdate] = useState(false);
    const [threads, setThreads] = useState([]);
    const { call, response, loading } = useAxios(THREADS, GET);

    useEffect(() => {
        call();
    },[update])

    useEffect(() => {
        setThreads(response?.data);
    },[response])
    
    return (<>
                <AddThread update={update} setUpdate={setUpdate} />
                <Flex direction='column' gap={20}>
                    {threads && threads.map((thread) => <ViewThread key={thread.id} data={thread} loading={loading} update={update} setUpdate={setUpdate} />)} 
                </Flex>
            </>
    );
}

export default ListThreads;