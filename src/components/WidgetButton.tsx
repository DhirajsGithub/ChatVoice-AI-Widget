import React from 'react';
import { FALLBACK_BOT_AVATAR } from '../constants/avatars';

interface WidgetButtonProps {
  onClick: () => void;
  agentAvatar?: string;
}

export const WidgetButton: React.FC<WidgetButtonProps> = ({ onClick, agentAvatar }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        backgroundColor: "#ffffff",
        border: "none",
        borderRadius: "50%",
        width: 56,
        height: 56,
        cursor: "pointer",
        boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
        padding: 0,
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.08)";
        e.currentTarget.style.boxShadow = "0 8px 22px rgba(0,0,0,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.15)";
      }}
    >
      <img
        src={agentAvatar || FALLBACK_BOT_AVATAR}
        alt="Agent Avatar"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "50%",
          backgroundColor: "#f9fafb",
          border: "2px solid #fff",
        }}
      />
    </button>
  );
};
