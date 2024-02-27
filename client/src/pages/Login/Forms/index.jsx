import { useNavigate } from 'react-router-dom';
import { TextInput, Button, Group, Box, Anchor, PasswordInput } from '@mantine/core';
import { useForm } from "@mantine/form";
import useAuth from '../../../authentication/useAuth';
import { useContext, useEffect } from 'react';
import { HOME, REGISTER } from '../../routes';
import { Session } from '../../../context';


const initialFormData = {
    initialValues: {
        username: '',
        password: ''
    },
    validate: {
        username: (value) => (value ? null : 'Invalid username'),
        password: (value) => (value.length >= 6 ? null : 'Password must have at least 6 characters'),
    },
}

function LoginForm() {
    const navigate = useNavigate();
    const form = useForm(initialFormData);
    const { loading, signIn, success } =  useAuth({ withProgressBar: true , withNotification: true });
    const { state } = useContext(Session);
    const { signedIn } = state;
   
    useEffect(() => {
        if(success || signedIn) navigate(HOME);
    }, [success])

    return (
        <Box w="100%" mx="auto">
            <form onSubmit={form.onSubmit((values) => signIn(values))}>
                <TextInput
                    withAsterisk
                    label="Username"
                    placeholder="username"
                    mb={10}
                    {...form.getInputProps('username')}
                />

                <PasswordInput
                    withAsterisk
                    label="Password"
                    placeholder="passowrd"
                    type='password'
                    {...form.getInputProps('password')}
                />

                <Group justify="space-between" mt="md">
                    <Anchor href={REGISTER}>Register here</Anchor>
                    <Button type="submit" loading={loading}>Submit</Button>
                </Group>
            </form>
        </Box>
    );
}

export default LoginForm;