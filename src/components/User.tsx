import type {Chat} from '../types/chat';

type ChatListItemProps = {
    chat: Chat;
};

function User({chat}: ChatListItemProps) {
    return (
        <li className={[
            "chat-list-item",
            chat.isActive ? "chat-list-item--active" : ""
        ].join(" ")}>
            <div className="chat-list-item__body">
                <div className="chat-list-item__top">
                    <span className="chat-list-item__title">{chat.title}</span>
                    <time className="chat-list-item__time">{chat.time}</time>
                </div>
                <div className="chat-list-item__bottom">
                    <p className="chat-list-item__preview">{chat.lastMessage}</p>
                    {chat.unreadCount ? (
                        <span className="chat-list-item__badge">{chat.unreadCount}</span>
                    ) : null}
                </div>
            </div>
        </li>
    );
}

export default User;
