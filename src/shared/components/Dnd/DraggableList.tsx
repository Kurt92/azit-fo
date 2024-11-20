'use client'

import React, {useState} from 'react';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {Box, Paper, Typography, IconButton, Checkbox, FormControlLabel, Divider} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

type Item = {
    id: string;
    content: string;
    checked: boolean;
};

const initialItems: Item[] = [
    { id: '1', content: 'Item 1', checked: false },
    { id: '2', content: 'Item 2', checked: false },
    { id: '3', content: 'Item 3', checked: false },
];

export default function DraggableList() {
    const [items, setItems] = useState(initialItems);

    const onDragEnd = (result: any) => {
        const {destination, source} = result;

        if (!destination) return;

        const updatedItems = Array.from(items);
        const [movedItem] = updatedItems.splice(source.index, 1);
        updatedItems.splice(destination.index, 0, movedItem);

        setItems(updatedItems);
    };

    const toggleCheckbox = (id: string) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, checked: !item.checked } : item
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
                        sx={{width: '100%', maxWidth: "95%", margin: 'auto', mt: 5}}
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
                                                mr: 2, // 아이콘과 텍스트 사이의 간격 조정
                                            }}
                                        >
                                            <DragIndicatorIcon/>
                                        </IconButton>

                                        {/* 아이템 내용 */}
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
                                                    my: 2,                  // 상하 간격 추가
                                                    mx: 2,                  // 양쪽 간격 추가
                                                    borderColor: 'grey.300' // 선 색상 설정
                                                }}
                                            />

                                            <div className={"flex-col"}>
                                                <Typography>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={item.checked}
                                                                onChange={() => toggleCheckbox(item.id)}
                                                                color="default"
                                                            />
                                                        }
                                                        label="AAA"
                                                    />
                                                </Typography>
                                                <Typography>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={item.checked}
                                                                onChange={() => toggleCheckbox(item.id)}
                                                                color="default"
                                                            />
                                                        }
                                                        label="AAA"
                                                    />
                                                </Typography>
                                            </div>
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
