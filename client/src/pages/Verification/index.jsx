import { Button, Box, Input, Text, Center, Title, Anchor, Card, Flex } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { Session } from '../../context';
import { useNavigate, useParams } from 'react-router-dom';
import useAxios, { POST } from '../../hooks/useAxios';
import { SIGNIN_SUCCESS } from '../../consts';
import { HOME, LOGIN, REGENERATE_CODE, REGISTER, VERIFY_EMAIL } from '../routes';

export default function Verification() {
    const navigate = useNavigate();
    const { id } = useParams();
    // verification code
    const [code, setCode] = useState();
    // context
    const { state, dispatch } = useContext(Session);
    const { signedIn, requireVerification } = state;
    // custom hooks call
    const { call, loading } = useAxios(VERIFY_EMAIL, POST, { withNotification: true })

    const verifyCode = async () => {
        const newPath = VERIFY_EMAIL.replace(':code', code).replace(':id', id);
        const response = await call({ newPath: newPath });
        // checking response if ok
        if(response && response.status == 201) {
            const user = response.data.user;
            dispatch({ action: SIGNIN_SUCCESS, user: user });
            navigate(HOME);
        }
        return;
    }

    const regenerateCode = async () => {
        const newPath = REGENERATE_CODE.replace(':id', id);
        await call({ newPath: newPath });
    }

    // redirect to home if no verification required
    useEffect(() => {
        !requireVerification && navigate(HOME);
    },[])

    // redirect to home if signed in
    useEffect(() => {
        signedIn && navigate(HOME);
    },[])

  return (
        <Center h="100vh" bg="whitesmoke">
            <Card w={400} mx="auto" shadow="sm" padding="lg" radius="md" withBorder>
                <Box w="100%" mx="auto">
                    <Center>
                        <Title order={2} mb={20}>Verification</Title>
                    </Center>
                    <Text mb={10}>Enter 6 digits code we sent to your email</Text>
                    <Input mb={10} type='number' maxLength={6} placeholder='#000000' onChange={(e) => setCode(e.target.value)}/>
                    <Flex justify='space-between' align='center'>
                        <Button onClick={verifyCode} loading={loading}>Confirm</Button>
                        <Anchor onClick={regenerateCode}>Regenerate verification code</Anchor>
                    </Flex>
                    <Center mt={20}>
                        <Anchor c='gray' href={LOGIN}>Login</Anchor> 
                        <Text c='gray' mx={5}>/</Text>
                        <Anchor c='gray' href={REGISTER}>Register</Anchor> 
                    </Center>
                </Box>
            </Card>
        </Center>
  )
}
