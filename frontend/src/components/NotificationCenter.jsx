import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import './NotificationCenter.css';

export default function NotificationCenter() {
  const { notifications, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="notification-center">
      <button className="notification-trigger" onClick={() => setOpen(!open)}>
        Notifications ({notifications.filter((n) => !n.read).length})
      </button>
      {open && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <button onClick={markAllAsRead}>Mark all read</button>
          </div>
          <div className="notification-list">
            {notifications.length === 0 ? (
              <p className="no-notifications">No notifications yet</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`notification-item ${n.read ? 'read' : 'unread'}`}
                >
                  <h4>{n.title}</h4>
                  <p>{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
