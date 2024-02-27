import { useEffect, useState } from 'react';
import classes from './styles.module.scss';
import { Card, Flex, Text } from '@mantine/core';
import useAxios, { GET } from '../../../hooks/useAxios';
import { COMMENTS } from '../../../pages/routes';
import ViewComment from '../View';
import AddComment from '../Add';


function ListComments({ thread, updateComments, setUpdateComments}) {
    const [comments, setComments] = useState([]);
    const { call, response, loading } = useAxios(COMMENTS.replace(':id', thread.id), GET);

    // fetch data on first render and on comments change
    useEffect(() => {
        call();
    },[updateComments])

    // setting comments list
    useEffect(() => {
        response && setComments(response.data);
    },[response])
    
    return (
        <Card className={classes.list} withBorder>
            {comments && <Text mb={5} c='gray' >{ "Comments(" + comments.length + ")" }</Text>}
            <AddComment threadId={thread.id} updateComments={updateComments} setUpdateComments={setUpdateComments}/>
            <Flex direction='column' gap={10}>
                {comments && comments.map((comment) => 
                <ViewComment key={comment.id} data={comment} loading={loading} updateComments={updateComments} setUpdateComments={setUpdateComments}/>)} 
            </Flex>
        </Card>
    );
}

export default ListComments;