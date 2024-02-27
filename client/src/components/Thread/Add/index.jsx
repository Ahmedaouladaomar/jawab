import { Button, Card, Textarea } from '@mantine/core';
import React, { useContext, useState } from 'react';
import useAxios, { POST } from '../../../hooks/useAxios';
import { THREADS } from '../../../pages/routes';
import { Session } from '../../../context';


export default function AddThread({ update, setUpdate }) {
    // state
    const [newThread, setNewThread] = useState('');
    // custom hooks
    const { call, loading } = useAxios(THREADS, POST, { withNotification: true });
    // context
    const { state } = useContext(Session);
    const { user } = state;

    const addThread = async () => {
        if(!(newThread && newThread.length)) return;
        await call({ body: { content: newThread, userId: user.id } });
        setUpdate(!update);
        setNewThread('');
    }

    return (
        <Card display='block' radius="sm" shadow='xs' mb={20}>
            <Textarea 
                value={newThread} 
                onChange={(e) => setNewThread(e.target.value)} 
                placeholder="Write what's on your mind..." 
                rows={4}
                maxRows={4}
                minLength={8}
            />
            <Button disabled={loading} mt={10} onClick={addThread}>
                Share
            </Button>
        </Card>
    )
}
