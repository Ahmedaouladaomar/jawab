import classes from './styles.module.scss';
import { Avatar, Button, Card, CloseButton, Divider, Flex, Input, Text } from '@mantine/core';
import { IconLock, IconLockOpen } from '@tabler/icons-react';
import { Session } from '../../context';
import { useState, useEffect, useContext } from "react";
import { useParams } from 'react-router-dom';
import useAxios, { GET, PATCH } from '../../hooks/useAxios';
import { USER, USER_UPDATE } from '../routes';
import { timeDiff } from '../../helpers';


function Profile() {
    // params hook
    const { username } = useParams();
    // user data states
    const [profileUser, setProfileUser] = useState();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    // lock state
    const [lock, setLock] = useState(true);
    // error and success states
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    // context
    const { state } = useContext(Session);
    const { user } = state;
    // custom hooks
    const { response, call, loading } = useAxios(USER.replace(':username', username), GET);

    const actionUpdate = () => {
        const regFirstName = firstName.replace(/\s/g,'');
        const regLastName = lastName.replace(/\s/g,'');
        const isEmptyFirstName = (regFirstName === '');
        const isEmptyLastName = (regLastName === '');
        if(isEmptyFirstName || isEmptyLastName ){
            setShowError(true);
            setShowSuccess(false);
            return;
        }
        // setting path and body
        const body = { firstName: firstName, lastName: lastName };
        const newPath = USER_UPDATE.replace(':id', profileUser.id);

        call({ newPath: newPath, newMethod: PATCH, body: body})
        .then(() => {
            setShowSuccess(true);
            setShowError(false);
        })
        .catch(() => {
            setShowError(true);
            setShowSuccess(false);
        })
    }

    // fetching data on first render
    useEffect(() => {
        call();
    },[])

    // setting profile user object
    useEffect(() => {
        if(!profileUser) response && setProfileUser(response.data);
    },[response])

     // setting user data
     useEffect(() => {
        if(!firstName) response && setFirstName(response.data.firstName);
    },[response])

     // setting user data
     useEffect(() => {
        if(!lastName) response && setLastName(response.data.lastName);
    },[response])

    return (
        <Card className={classes.card} shadow='xs'>
            <Flex direction='column' align='center'>
                <Avatar size='lg'/>
                <Text>{profileUser?.username}</Text>
                <Text c='gray'>{profileUser?.threads?.length} threads</Text>
            </Flex>
            <Divider my={20} label={<Text>Personal information</Text>} labelPosition='center' />
            <Flex gap={15} wrap='wrap'>
                <Flex align='center' gap={5}>
                    <Text>Firstname:</Text>
                    <Input className={classes.input} disabled={lock} type='text' value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                </Flex>
                <Flex align='center' gap={5}>
                    <Text>Lastname:</Text>
                    <Input className={classes.input} disabled={lock} type='text' value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                </Flex>
            </Flex>
            <Flex display={showError ? 'flex' : 'none'} className={classes.close_error} mt={10} py={5} pr={15} bg='red' c='white' align='center' gap={5}>
                <CloseButton onClick={() => setShowError(false)} c='white' variant='transparent'/>
                <Text>Error, try again</Text>
            </Flex>
            <Flex display={showSuccess ? 'flex' : 'none'} className={classes.close_success} mt={10} py={5} pr={15} bg='green' c='white' align='center' gap={5}>
                <CloseButton onClick={() => setShowSuccess(false)} c='white' variant='transparent'/>
                <Text>Modifications are saved</Text>
            </Flex>
            <Divider my={20} />
            <Flex justify='space-between' wrap='wrap-reverse' gap={10}>
                <Text c='gray'>Joined {timeDiff(Date.now(), profileUser?.date_created)}</Text>
                {profileUser?.id === user.id &&
                <Flex gap={10} wrap='wrap-reverse'>
                    <Button disabled={lock} onClick={actionUpdate} loading={loading}>Submit</Button>
                    <Button bg='gray' onClick={() => setLock(!lock)}>{lock ? <><IconLockOpen />Unlock</> : <><IconLock />Lock</>}</Button>
                </Flex>}
            </Flex>
            
        </Card>
    );
}

export default Profile;