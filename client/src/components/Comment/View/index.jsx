import React, { useContext, useEffect, useState } from 'react';
import { ActionIcon, Anchor, Button, Card, Flex, Group, Menu, Modal, Skeleton, Text, rem } from '@mantine/core';
import { timeDiff } from '../../../helpers';
import { IconDots, IconReport, IconTrash } from '@tabler/icons-react';
import classes from './styles.module.scss';
import { Session } from '../../../context';
import useAxios, { DELETE } from '../../../hooks/useAxios';
import { COMMENT, PROFILE } from '../../../pages/routes';
import { useDisclosure } from '@mantine/hooks';

export default function ViewComment({ data, updateComments, setUpdateComments }) { 
    const [comment, setComment] = useState();
    const { call } = useAxios(COMMENT, DELETE, { withNotification: true });
    const { state } = useContext(Session);
    const { user } = state;
    // modal
    const [opened, { open, close }] = useDisclosure(false);
    
    // handling delete comment
    const actionDeleteComment = () => {
        call({ newPath: COMMENT.replace(':id', comment?.id) })
        .then(() => setUpdateComments(!updateComments))
        .finally(() => close())
    }

    // setting comment data
    useEffect(() => {
        setComment(data);
    },[data])

  return (
      <Skeleton visible={!comment}>
        <Modal opened={opened} onClose={close} title="Confirmation">
            <Modal.Body>
                Are you sure you want to delete this comment?
            </Modal.Body>
            <Flex justify='space-between'>
                <Button onClick={actionDeleteComment}>Confirm</Button>
                <Button bg='red' onClick={close}>Close</Button>
            </Flex>
        </Modal>

        <Card className={classes.comment} radius="sm" shadow='none' withBorder>
            <Card.Section inheritPadding py="xs">
                <Group wrap='nowrap' justify="space-between">
                    <Text fz='sm' fw={400}>{comment?.content}</Text>
                    <Menu withinPortal position="bottom-end" shadow="sm">
                        <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
                                <IconDots style={{ width: rem(16), height: rem(16) }} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                        { user.id === comment?.user.id ?
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
            <Flex align='center' justify='space-between' wrap='wrap'>
            <Text c='gray'size="sm">
                {comment && timeDiff(Date.now(), comment.date_created)}
            </Text>
            <Flex gap={5} align='center'>
                <Text c='gray' size="sm">Posted by</Text>
                <span>
                    <Anchor href={`${PROFILE.replace(':username', comment?.user.username)}`}>
                        {user.username === comment?.user.username ? 'you' : comment?.user.username}
                    </Anchor>
                </span>
            </Flex>
            </Flex>
        </Card>
      </Skeleton>
  )
}
