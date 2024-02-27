import React, { useContext, useEffect, useState } from 'react'
import { Card, Group, Text, Menu, ActionIcon, rem, Skeleton, Flex, Grid, Button, Divider, Anchor, Modal } from '@mantine/core';
import { IconDots, IconReport, IconThumbUp, IconThumbUpFilled, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks'
import classes from './styles.module.scss';
import { timeDiff } from '../../../helpers';
import { Session } from '../../../context';
import useAxios, { DELETE, PATCH } from '../../../hooks/useAxios';
import { THREADS, THREAD, PROFILE } from '../../../pages/routes';
import ListComments from '../../Comment/List';

export default function ViewThread({ data, update, setUpdate }) {
    // componant states
    const [updateComments, setUpdateComments] = useState(false);
    const [thread, setThread] = useState();
    const [reaction, setReaction] = useState(false);
    const [count, setCount] = useState(0);

    // custom hooks
    const { call } = useAxios(THREADS, PATCH);

    // context
    const { state } = useContext(Session);
    const { user } = state;

    //modal
    const [opened, { open, close }] = useDisclosure(false);
    
    const actionDeleteThread = () => {
        thread && call({ newPath: THREAD.replace(':id', thread.id), newMethod: DELETE })
        .then(() => setUpdate(!update))
        .finally(() => close());
    }

    const toggleAction = () => {
        setReaction(!reaction);
        const newPath = `${THREADS}/${thread.id}`;
        const body = { action: true, user: user.id };
        if(!reaction) setCount(count + 1);
        else count && setCount(count - 1);
        call({ newPath, body });
    }

    // setting thread data
    useEffect(() => {
        setThread(data);
    },[data])

    // reactions count
    useEffect(() => {
        setCount(data?.reactions.length);
    },[data])

    // check if thread is liked by current user
    useEffect(() => {
        if(data){
            let indexOfElement = data.reactions.indexOf(user.id)
            let found = (indexOfElement != -1);
            setReaction(!!found);
        }
    },[data])

  return (
    <Skeleton visible={!thread}>
        <Modal opened={opened} onClose={close} title="Confirmation">
            <Modal.Body>
                Are you sure you want to delete this thread?
            </Modal.Body>
            <Flex justify='space-between'>
                <Button onClick={actionDeleteThread}>Confirm</Button>
                <Button bg='red' onClick={close}>Close</Button>
            </Flex>
        </Modal>
        <Card className={classes.thread} radius="sm" shadow='xs'>
            <Card.Section inheritPadding py="xs">
                <Group wrap='nowrap' justify="space-between">
                    <Text fw={500}>{thread?.content}</Text>
                    <Menu withinPortal position="bottom-end" shadow="sm">
                        <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
                                <IconDots style={{ width: rem(16), height: rem(16) }} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            { user.id === thread?.user.id ?
                                <Menu.Item
                                  leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                                  color="red"
                                  onClick={open}
                                >
                                  Delete
                                </Menu.Item> 
                              :
                                <Menu.Item
                                    leftSection={<IconReport style={{ width: rem(14), height: rem(14) }} />}
                                    color="blue"
                                >
                                    Report
                                </Menu.Item> 
                            }
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Card.Section>
            <Flex align='center' justify='space-between' wrap='wrap' mb={10}>
                <Text className={classes.date} c='gray' size="sm">
                    {timeDiff(Date.now(), thread?.date_created)}
                </Text>
                <div>
                    <Grid align='center'>
                        <Grid.Col span='content'>
                            <Flex align='center' gap={5}>
                                <Text className={classes.posted} c='gray' size="sm">Posted by</Text>
                                <span>
                                    <Anchor className={classes.owner} href={`${PROFILE.replace(':username', thread?.user.username)}`}>
                                        {user.username === thread?.user.username ? 'you' : thread?.user.username}
                                    </Anchor>
                                </span>
                            </Flex>
                        </Grid.Col>
                        <Grid.Col className={classes.divider} span='content'>
                            <span>|</span>
                        </Grid.Col>
                        <Grid.Col span='content'>
                            <Button className={classes.like} size='xs' onClick={toggleAction} component={ reaction ? IconThumbUpFilled : IconThumbUp } />
                            <span>{count > 0 && count}</span>
                        </Grid.Col>
                    </Grid>
                </div>
            </Flex>

            {thread &&
            <ListComments thread={thread} updateComments={updateComments} setUpdateComments={setUpdateComments}/>}
        </Card>
    </Skeleton>
  )
}
