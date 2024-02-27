import React, { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { HOME, PROFILE } from '../../pages/routes';
import { Anchor, Box, Button, Drawer, Flex, Image, Menu, NavLink, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBurger, IconEdit, IconHome, IconLogout, IconUser } from '@tabler/icons-react';
import classes from './styles.module.scss';
import { Session } from '../../context';
import useAuth from '../../authentication/useAuth';
import logo from '../../images/jawab-logo.png'

export default function Header() {
    const location = useLocation();
    const [opened, { open, close }] = useDisclosure(false);
    const { state } = useContext(Session);
    const { user } = state;
    // custom hooks
    const { signOut } = useAuth();

    return (
        <Box className={classes.header}>
            <Image src={logo} h={40} fit='contain' />
            <Flex className={classes.center} justify='center' gap={5}>
                <NavLink
                    className={classes.link}
                    active={location.pathname == HOME}
                    href={HOME}
                    label={<Text>Home</Text>}
                    leftSection={<IconHome stroke={1.5} />}
                    w='fit-content'
                />
                <NavLink
                    className={classes.link}
                    active={location.pathname == PROFILE.replace(':username', user.username)}
                    href={PROFILE.replace(':username', user.username)}
                    label={<Text>Profile</Text>}
                    leftSection={<IconEdit stroke={1.5} />}
                    w='fit-content'
                />
            </Flex>
            <Menu className={classes.cta} shadow="md" width={200} position='bottom-end'>
                <Menu.Target>
                    <Button>
                        <IconUser/>
                    </Button>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Label>
                        <Text c='dark'>
                            {user.firstName + ' ' + user.lastName}
                        </Text>
                    </Menu.Label>
                    <Menu.Divider />
                    <Menu.Item leftSection={<IconLogout/>} onClick={() => signOut() }>
                        Logout
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>

            <Drawer opened={opened} onClose={close} size='100%'>
                <Flex w='100%' justify='center' gap={5} direction='column'>
                    <NavLink
                        className={classes.link}
                        active={location.pathname == HOME}
                        href={HOME}
                        label={<Text>Home</Text>}
                        leftSection={<IconHome stroke={1.5} />}
                        w='fit-content'
                    />
                    <NavLink
                        className={classes.link}
                        active={location.pathname == PROFILE.replace(':username', user.username)}
                        href={PROFILE.replace(':username', user.username)}
                        label={<Text>Profile</Text>}
                        leftSection={<IconEdit stroke={1.5} />}
                        w='fit-content'
                    />
                    <Anchor pos='absolute' bottom={20} onClick={() => signOut()}>Logout</Anchor>
                </Flex>
            </Drawer>
            <Button className={classes.burger} onClick={open} component={IconBurger} />
        </Box>
    )
}
