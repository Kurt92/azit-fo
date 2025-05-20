import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme,
    Box
} from '@mui/material';

export interface Post {
    id: number;
    title: string;
    author: string;
    date: string;
    views: number;
    category?: string;
}

interface BoardTableProps {
    posts: Post[];
    onRowClick?: (post: Post) => void;
}

export default function BoardTable({ posts, onRowClick }: BoardTableProps) {
    const theme = useTheme();
    
    const headerStyle = {
        backgroundColor: '#2A2D32',
        color: '#B0B4BA',
        fontWeight: 700,
        fontSize: '1rem',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottom: `2px solid ${theme.palette.grey[800]}`,
        letterSpacing: 1.2,
    };

    const cellStyle = {
        color: '#B0B4BA',
        backgroundColor: '#2A2D32',
        borderBottom: `1px solid ${theme.palette.grey[800]}`,
        fontSize: '0.97rem',
        fontWeight: 500,
    };

    const rowStyle = {
        '&:hover': {
            backgroundColor: '#31343A',
            cursor: 'pointer',
        },
        '&:last-child td': {
            borderBottom: 0,
        },
        transition: 'background 0.2s',
    };

    return (
        <Box sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)' }}>
            <TableContainer sx={{ backgroundColor: '#23272A' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width="10%" sx={headerStyle}>번호</TableCell>
                            <TableCell width="50%" sx={headerStyle}>제목</TableCell>
                            <TableCell width="15%" sx={headerStyle}>작성자</TableCell>
                            <TableCell width="15%" sx={headerStyle}>작성일</TableCell>
                            <TableCell width="10%" align="right" sx={headerStyle}>조회수</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {posts.map((post) => (
                            <TableRow 
                                key={post.id}
                                hover
                                onClick={() => onRowClick?.(post)}
                                sx={rowStyle}
                            >
                                <TableCell sx={cellStyle}>{post.id}</TableCell>
                                <TableCell sx={cellStyle}>{post.title}</TableCell>
                                <TableCell sx={cellStyle}>{post.author}</TableCell>
                                <TableCell sx={cellStyle}>{post.date}</TableCell>
                                <TableCell align="right" sx={cellStyle}>{post.views}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
} 