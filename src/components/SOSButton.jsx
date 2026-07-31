import React, { useState, useRef } from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function SOSButton({ isEmergency, toggleEmergency, onMessageSelect }) {
  const [showMenu, setShowMenu] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(null);
  const pressTimer = useRef(null);

  const menuConfig = [
    { id: 'accident', text: "I'm in an accident", top: -130, left: 0 },
    { id: 'injured', text: "I'm injured", top: 0, left: 130 },
    { id: 'following', text: "Someone is following me", top: 130, left: 0 },
    { id: 'abducted', text: "I'm abducted", top: 0, left: -130 },
  ];

  const handlePointerDown = (e) => {
    e.target.setPointerCapture(e.pointerId);
    pressTimer.current = setTimeout(() => {
      setShowMenu(true);
      if (navigator.vibrate) navigator.vibrate(50);
    }, 450); // 450ms long press threshold
  };

  const handlePointerMove = (e) => {
    if (!showMenu) return;

    const rect = e.target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 60) {
      let hovered = null;
      if (dy < -Math.abs(dx)) hovered = 'accident';
      else if (dx > Math.abs(dy)) hovered = 'injured';
      else if (dy > Math.abs(dx)) hovered = 'following';
      else if (dx < -Math.abs(dy)) hovered = 'abducted';
      
      if (hovered !== hoveredOption) {
        setHoveredOption(hovered);
        if (navigator.vibrate) navigator.vibrate(20);
      }
    } else {
      if (hoveredOption !== null) setHoveredOption(null);
    }
  };

  const handlePointerUp = (e) => {
    clearTimeout(pressTimer.current);
    if (!showMenu) {
      toggleEmergency();
    } else {
      if (hoveredOption && onMessageSelect) {
        const msgText = menuConfig.find(m => m.id === hoveredOption)?.text;
        if (msgText) onMessageSelect(msgText);
      }
      setShowMenu(false);
      setHoveredOption(null);
    }
    e.target.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="sos-container animate-slide-up" style={{ animationDelay: '0.1s' }}>
      {menuConfig.map((menu) => (
        <div 
          key={menu.id} 
          className={`radial-menu-item ${hoveredOption === menu.id ? 'hovered' : ''}`}
          style={{
            transform: `translate(calc(${menu.left}px - 50%), calc(${menu.top}px - 50%)) scale(${showMenu ? (hoveredOption === menu.id ? 1.1 : 1) : 0})`,
            opacity: showMenu ? 1 : 0,
            transitionDelay: showMenu ? '0s' : '0.2s'
          }}
        >
          {menu.text}
        </div>
      ))}

      <button 
        className={`sos-btn ${isEmergency ? 'active' : ''} ${showMenu ? 'menu-open' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="sos-rings">
          <div className="ring ring-1"></div>
          <div className="ring ring-2"></div>
        </div>
        <div className="sos-content">
          {isEmergency ? (
            <>
              <ShieldCheck size={48} className="sos-icon" />
              <span>MARK SAFE</span>
            </>
          ) : (
            <>
              <AlertTriangle size={48} className="sos-icon" />
              <span>SOS</span>
            </>
          )}
        </div>
      </button>

      <style>{`
        .sos-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 3rem 0;
          position: relative;
        }

        .radial-menu-item {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100px; /* Kept slightly small for fit */
          background: rgba(11, 14, 20, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: white;
          padding: 0.8rem 0.5rem;
          border-radius: 12px;
          text-align: center;
          font-size: 0.75rem;
          line-height: 1.2;
          font-weight: 700;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease, background 0.2s ease;
          z-index: 10;
          pointer-events: none; /* Let drag capture handle events */
        }
        
        .radial-menu-item.hovered {
          border-color: var(--sos-info);
          background: var(--sos-info);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.5);
          color: #fff;
        }

        .sos-btn {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          position: relative;
          background: ${isEmergency ? 'var(--sos-safe)' : 'var(--sos-danger)'};
          color: white;
          box-shadow: 0 10px 40px ${isEmergency ? 'rgba(16, 185, 129, 0.4)' : 'var(--sos-danger-glow)'};
          z-index: 2;
          overflow: visible;
          touch-action: none; /* Prevents screen scrolling during drag interaction */
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .sos-btn.menu-open {
          transform: scale(0.85); /* Shrinks when menu is active */
          box-shadow: 0 0px 10px var(--sos-danger-glow);
        }

        .sos-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: 2px;
          position: relative;
          z-index: 3;
          pointer-events: none; /* Prevents text from grabbing pointer */
        }

        .sos-icon {
          margin-bottom: 4px;
        }

        .sos-rings {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          border-radius: 50%;
          z-index: 1;
          pointer-events: none;
        }

        .ring {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: ${isEmergency ? 'var(--sos-safe)' : 'var(--sos-danger)'};
        }

        ${!isEmergency ? `
        .ring-1 {
          animation: pulseGlow 2s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
        }
        .ring-2 {
          animation: pulseGlow 2s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
          animation-delay: 1s;
        }
        ` : ''}
      `}</style>
    </div>
  );
}
