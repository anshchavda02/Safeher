import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Phone, PhoneOff, User } from 'lucide-react';

export default function FakeCallScreen({ callerName = "Dad", onDecline }) {
  const audioCtxRef = useRef(null);

  useEffect(() => {
    // Generate a simple ringing tone
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = audioCtx;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 440; // A4
    
    const now = audioCtx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    
    // Repeat for several rings
    for(let i = 0; i < 30; i += 3) {
      gainNode.gain.setValueAtTime(1, now + i);
      gainNode.gain.setValueAtTime(0, now + i + 1.5);
    }

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();

    return () => {
      oscillator.stop();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return createPortal(
    <div className="fake-call-overlay">
      <div className="caller-info animate-slide-down">
        <h2 className="caller-status">incoming call</h2>
        <div className="caller-avatar">
          <User size={60} color="#fff" />
        </div>
        <h1 className="caller-name">{callerName}</h1>
        <p className="caller-type">Mobile</p>
      </div>

      <div className="call-actions animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="action-btn-group">
          <button className="decline-btn round-btn" onClick={onDecline}>
            <PhoneOff size={32} />
          </button>
          <span>Decline</span>
        </div>
        <div className="action-btn-group">
          <button className="accept-btn round-btn" onClick={onDecline}>
            <Phone size={32} className="shake-anim" />
          </button>
          <span>Accept</span>
        </div>
      </div>

      <style>{`
        .fake-call-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(180deg, #1a1a2e 0%, #000000 100%);
          z-index: 10000;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 6rem 2rem;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .caller-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .caller-status {
          font-size: 1rem;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 2rem;
        }

        .caller-avatar {
          width: 120px;
          height: 120px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 1.5rem;
          box-shadow: 0 0 30px rgba(0,0,0,0.5);
        }

        .caller-name {
          font-size: 2.5rem;
          font-weight: 300;
          margin: 0 0 0.5rem;
        }

        .caller-type {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
        }

        .call-actions {
          display: flex;
          justify-content: space-around;
          padding: 0 2rem;
        }

        .action-btn-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .action-btn-group span {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.8);
        }

        .round-btn {
          width: 75px;
          height: 75px;
          border-radius: 50%;
          border: none;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          color: white;
          transition: transform 0.2s;
        }

        .round-btn:active {
          transform: scale(0.9);
        }

        .decline-btn {
          background: #ff3b30;
        }

        .accept-btn {
          background: #34c759;
        }

        .shake-anim {
          animation: phoneRing 0.5s infinite alternate;
        }

        @keyframes phoneRing {
          0% { transform: rotate(-15deg); }
          100% { transform: rotate(15deg); }
        }
      `}</style>
    </div>,
    document.body
  );
}
