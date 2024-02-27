import { Button, Card, Textarea } from '@mantine/core';
import React, { useContext, useState } from 'react';
import useAxios, { POST } from '../../../hooks/useAxios';
import { COMMENTS } from '../../../pages/routes';
import { Session } from '../../../context';
import classes from './styles.module.scss';


export default function AddComment({ threadId, updateComments, setUpdateComments }) {
    const [newComment, setNewComment] = useState('');
    const { call, loading } = useAxios(COMMENTS.replace(':id', threadId), POST, { withNotification: true });
    const { state } = useContext(Session);
    const { user } = state;

    const addComment = async () => {
        if(!(newComment && newComment.length)) return;
        await call({ body: { content: newComment, userId: user.id } });
        setUpdateComments(!updateComments);
        setNewComment('');
    }

    return (
        <Card className={classes.add} display='block' padding={0} radius="sm" shadow='none' mb={20}>
            <Textarea 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)} 
                placeholder="Write a comment..." 
                rows={2}
                maxRows={2}
                minLength={8}
            />
            <Button disabled={loading} mt={10} onClick={addComment}>
                Comment
            </Button>
        </Card>
    )
}
