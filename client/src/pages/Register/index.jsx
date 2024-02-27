import RegisterForm from "./Forms";
import { Card, Center, Flex, Image, Title } from "@mantine/core";
import logo from '../../images/jawab-logo.png';

function Register() {
    return (
        <Center h="100vh" bg="whitesmoke" p={10}>
            <Card w={400} mx="auto" shadow="sm" padding="lg" radius="md" withBorder>
                <Center>
                    <Flex direction='column' align='center' gap={30}>
                        <Image src={logo} h={50} fit='contain' />
                        <Title order={2}>Register</Title>
                    </Flex>
                </Center>
                <RegisterForm />
            </Card>
        </Center>
    );
}

export default Register;