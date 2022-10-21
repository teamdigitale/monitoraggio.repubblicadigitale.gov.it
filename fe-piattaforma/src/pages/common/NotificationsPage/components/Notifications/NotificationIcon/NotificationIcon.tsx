import React from "react";
import HeartIconRead from '/public/assets/img/it-heart-primary.png'
import HeartIconUnread from '/public/assets/img/it-heart.png'
import CommentIconRead from '/public/assets/img/it-comment-primary.png'
import CommentIconUnread from '/public/assets/img/it-comment.png'
import ReporIcon from '/public/assets/img/it-report.png'
import BellIconRead from '/public/assets/img/it-bell-primary.png'
import BellIconUnreaad from '/public/assets/img/it-bell.png'

interface NotificationIconI {
    action: string;
    status: boolean;
}

const NotificationIcon = ({ action, status }: NotificationIconI) => {

    const getIconByAction = (action: string, status: boolean) => {
        switch (action) {
            case 'board_update':
            case 'community_update':
            case 'document_update':
            case 'comment_update':
            case 'board_delete':
            case 'community_delete':
            case 'document_delete':
            case 'comment_delete':
                return status ? BellIconRead : BellIconUnreaad
            case 'board_like':
            case 'community_like':
            case 'document_like':
            case 'comment_like':
                return status ? HeartIconRead : HeartIconUnread
            case 'board_comment':
            case 'community_comment':
            case 'document_comment':
            case 'comment_reply':
                return status ? CommentIconRead : CommentIconUnread
            case 'board_report':
            case 'community_report':
            case 'document_report':
            case 'comment_report':
                return ReporIcon
            default:
                break;
        }
        return status ? BellIconRead : BellIconUnreaad
    }
    
    return <div
    className="d-flex align-items-center justify-content-center"
    style={{
        minWidth: '40px',
        height: '40px',
        borderRadius: action.includes('report') ? 'none' : '100%',
        backgroundColor: action.includes('report') ? 'inherit' : status ? '#d1e7ff' : '#06c'
    }}>
        <img width={action.includes('report') ? '36' : '16'} height="auto" src={getIconByAction(action, status)} alt="notification-icon" />
    </div>
}

export default NotificationIcon