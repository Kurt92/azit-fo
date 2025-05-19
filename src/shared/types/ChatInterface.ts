export interface IChatRoom {
    chatRoomId: number;
    roomNm: string;
    lastMessage: string;
    lastMessageTime?: string;
    unreadCount?: number;
}

export interface IFriend {
    targetId: number;
    targetNm: string;
    status: 'online' | 'offline' | 'away';
    avatarUrl?: string;
    isPending?: boolean;
}

export interface IMessage {
    chatRoomId: number;
    senderId: number;
    senderNm: string;
    createDt: string;
    userName: string;
    message: string;
}

export interface IFriendRequest {
    userMappingId: number;
    targetId: number;
    targetNm: string;
}
