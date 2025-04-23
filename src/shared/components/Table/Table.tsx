import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme,
} from '@mui/material';

export interface Post {
    id: number;
    title: string;
    author: string;
    date: string;
    views: number;
}

interface BoardTableProps {
    posts: Post[];
    onRowClick?: (post: Post) => void;
}

export default function BoardTable({ posts, onRowClick }: BoardTableProps) {
    const theme = useTheme();
    
    const headerStyle = {
        backgroundColor: theme.palette.grey[900],
        color: theme.palette.common.white,
        fontWeight: 'bold',
        fontSize: '0.95rem',
    };

    const cellStyle = {
        color: theme.palette.common.white,
        borderBottom: `1px solid ${theme.palette.grey[800]}`,
    };

    const rowStyle = {
        '&:hover': {
            backgroundColor: theme.palette.grey[800],
            cursor: 'pointer',
        },
        // 마지막 행의 border 제거
        '&:last-child td': {
            borderBottom: 0,
        },
    };

    return (
        <TableContainer sx={{ backgroundColor: theme.palette.grey[900], borderRadius: 1 }}>
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
    );
} 