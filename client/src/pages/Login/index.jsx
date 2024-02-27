import LoginForm from "./Forms";
import { Card, Center, Flex, Image, Title } from "@mantine/core";
import logo from '../../images/jawab-logo.png';

function Login() {
    return (
        <Center h="100vh" bg="whitesmoke" p={10}>
            <Card w={400} mx="auto" shadow="sm" padding="lg" radius="md" withBorder>
                <Center>
                    <Flex direction='column' align='center' gap={30}>
                        <Image src={logo} h={40} fit='contain' />
                        <Title order={2}>Login</Title>
                    </Flex>
                </Center>
                <LoginForm />
            </Card>
        </Center>
    );
}

export default Login;