import React, { useState } from 'react';

interface AgentWidgetProps {
  config: any;
}

export const AgentWidget: React.FC<AgentWidgetProps> = ({ config }) => {
  const [open, setOpen] = useState(false);

  const { position = 'bottom-right', theme, agent } = config || {};

  const positionStyles =
    position === 'bottom-left'
      ? { left: '20px', bottom: '20px' }
      : { right: '20px', bottom: '20px' };

  return (
    <div style={{ position: 'fixed', zIndex: 9999, ...positionStyles }}>
      {open ? (
        <div
          style={{
            width: 320,
            height: 400,
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background: theme?.primaryColor || '#4F46E5',
              color: '#fff',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {agent?.avatar && (
                <img
                  src={agent.avatar}
                  alt="avatar"
                  style={{ width: 24, height: 24, borderRadius: '50%' }}
                />
              )}
              <span>{agent?.name || 'HelperBot'}</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '18px',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>

          <div style={{ flex: 1, padding: 12, overflowY: 'auto' }}>
            <p style={{ color: '#555' }}>👋 Hello! How can I help you?</p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          style={{
            background: theme?.primaryColor || '#4F46E5',
            color: '#fff',
            borderRadius: '50%',
            width: 60,
            height: 60,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          💬
        </button>
      )}
    </div>
  );
};
