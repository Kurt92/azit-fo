'use client';

import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Box, Paper, Typography, IconButton, Checkbox, FormControlLabel, Divider } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

type Item = {
    id: string;
    content: string;
    checks: {
        aaa: boolean;
        bbb: boolean;
        ccc: boolean;
    };
};

const initialItems: Item[] = [
    { id: '1', content: 'Item 1', checks: { aaa: false, bbb: false, ccc: false } },
    { id: '2', content: 'Item 2', checks: { aaa: false, bbb: false, ccc: false } },
    { id: '3', content: 'Item 3', checks: { aaa: false, bbb: false, ccc: false } },
];

export default function DraggableList() {
    const [items, setItems] = useState(initialItems);

    const onDragEnd = (result: any) => {
        const { destination, source } = result;

        if (!destination) return;

        const updatedItems = Array.from(items);
        const [movedItem] = updatedItems.splice(source.index, 1);
        updatedItems.splice(destination.index, 0, movedItem);

        setItems(updatedItems);
    };

    const toggleCheckbox = (id: string, key: keyof Item['checks']) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id
                    ? { ...item, checks: { ...item.checks, [key]: !item.checks[key] } }
                    : item
            )
        );
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="list">
                {(provided) => (
                    <Box
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        sx={{ width: '100%', maxWidth: '95%', margin: 'auto', mt: 5 }}
                    >
                        {items.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided) => (
                                    <Box
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: 1,
                                            width: '100%',
                                        }}
                                    >
                                        <IconButton
                                            {...provided.dragHandleProps}
                                            sx={{
                                                cursor: 'grab',
                                                color: 'primary.main',
                                                mr: 2,
                                            }}
                                        >
                                            <DragIndicatorIcon />
                                        </IconButton>

                                        <Paper
                                            sx={{
                                                padding: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                backgroundColor: 'primary.light',
                                                color: 'white',
                                                width: '100%',
                                            }}
                                        >
                                            <Typography>{item.content}</Typography>

                                            <Divider
                                                sx={{
                                                    my: 2,
                                                    mx: 2,
                                                    borderColor: 'grey.300',
                                                }}
                                            />

                                            <Box sx={{display: 'flex', flexDirection: 'column',}}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={item.checks.aaa}
                                                            onChange={() => toggleCheckbox(item.id, 'aaa')}
                                                            color="default"
                                                        />
                                                    }
                                                    label="AAA"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={item.checks.bbb}
                                                            onChange={() => toggleCheckbox(item.id, 'bbb')}
                                                            color="default"
                                                        />
                                                    }
                                                    label="BBB"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={item.checks.ccc}
                                                            onChange={() => toggleCheckbox(item.id, 'ccc')}
                                                            color="default"
                                                        />
                                                    }
                                                    label="CCC"
                                                />
                                            </Box>
                                        </Paper>
                                    </Box>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </Box>
                )}
            </Droppable>
        </DragDropContext>
    );
}
