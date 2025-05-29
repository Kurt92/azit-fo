'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import BoardDetail from '@/wedgets/Board/ui/BoardDetail';

export default function BoardDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();

    return (
        <BoardDetail 
            boardId={parseInt(params.id)} 
            onBack={() => router.push('/board')} 
        />
    );
} 