import React, { useState, useEffect } from 'react';
import { Timer, XCircle, ShieldAlert } from 'lucide-react';

export default function CheckInTimer({ onTimerExpire }) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [duration, setDuration] = useState(10); // Default 10 mins
  const [showPinPad, setShowPinPad] = useState(false);
  const [pinInput, setPinInput] = useState('');
  
  // Hardcoded for demo, normally would be set by user
  const SAFE_PIN = "1234"; 

  useEffect(() => {
    let intervalId;
    if (isActive) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            setIsActive(false);
            onTimerExpire("CHECK-IN TIMER EXPIRED! I might be in danger.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isActive, onTimerExpire]);

  const startTimer = () => {
    setTimeLeft(duration * 60);
    setIsActive(true);
  };

  const attemptCancel = () => {
    setShowPinPad(true);
    setPinInput('');
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === SAFE_PIN) {
      setIsActive(false);
      setShowPinPad(false);
      setTimeLeft(0);
    } else {
      alert("Incorrect PIN!");
      setPinInput('');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer-panel glass-panel animate-slide-up" style={{ animationDelay: '0.25s' }}>
      <div className="timer-header">
        <div className="header-title">
          <Timer size={20} color={isActive ? "var(--sos-danger)" : "var(--text-secondary)"} />
          <h3>Check-In Timer</h3>
        </div>
        {isActive && <div className="pulsing-dot"></div>}
      </div>

      {!isActive ? (
        <div className="timer-setup">
          <p className="timer-desc">Set a countdown when entering a risky situation. If you don't cancel it with your PIN ({SAFE_PIN}) before it reaches zero, SOS mode will activate.</p>
          <div className="timer-controls">
            <select 
              value={duration} 
              onChange={(e) => setDuration(Number(e.target.value))}
              className="duration-select"
            >
              <option value={2}>2 Minutes</option>
              <option value={5}>5 Minutes</option>
              <option value={10}>10 Minutes</option>
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
            </select>
            <button className="btn-start-timer" onClick={startTimer}>
              Start Timer
            </button>
          </div>
        </div>
      ) : showPinPad ? (
        <form onSubmit={handlePinSubmit} className="pin-pad">
          <p>Enter Safe PIN to cancel:</p>
          <input 
            type="password" 
            pattern="[0-9]*" 
            inputMode="numeric"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="****"
            maxLength={4}
            autoFocus
          />
          <div className="pin-actions">
            <button type="button" className="btn-secondary" onClick={() => setShowPinPad(false)}>Back</button>
            <button type="submit" className="btn-danger">Confirm</button>
          </div>
        </form>
      ) : (
        <div className="timer-active-display">
          <div className="countdown-clock">
            {formatTime(timeLeft)}
          </div>
          <p className="warning-text">SOS will trigger if not cancelled.</p>
          <div className="active-actions">
            <button className="btn-cancel-timer" onClick={attemptCancel}>
              <XCircle size={18} /> Cancel Timer
            </button>
            <button className="btn-panic-now" onClick={() => {
              setIsActive(false);
              onTimerExpire("EMERGENCY triggered manually from Check-In Timer.");
            }}>
              <ShieldAlert size={18} /> Panic Now
            </button>
          </div>
        </div>
      )}

      <style>{`
        .timer-panel {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border-color: ${isActive ? 'rgba(255, 42, 77, 0.3)' : 'var(--glass-border)'};
          transition: border-color 0.3s ease;
        }

        .timer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--glass-border);
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .header-title h3 {
          font-size: 1.1rem;
          font-weight: 600;
        }

        .pulsing-dot {
          width: 10px;
          height: 10px;
          background: var(--sos-danger);
          border-radius: 50%;
          animation: pulseDot 1s infinite alternate;
        }
        @keyframes pulseDot {
          from { opacity: 0.4; box-shadow: 0 0 0px var(--sos-danger); }
          to { opacity: 1; box-shadow: 0 0 8px var(--sos-danger); }
        }

        .timer-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        .timer-controls {
          display: flex;
          gap: 0.75rem;
        }

        .duration-select {
          flex: 1;
          background: rgba(0,0,0,0.3);
          border: 1px solid var(--glass-border);
          color: white;
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          font-family: inherit;
          font-size: 1rem;
          outline: none;
        }

        .btn-start-timer {
          flex: 1;
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.4);
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 1rem;
        }
        .btn-start-timer:active { transform: scale(0.96); }

        .timer-active-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0 0;
        }

        .countdown-clock {
          font-size: 3.5rem;
          font-weight: 800;
          font-family: monospace;
          color: var(--sos-danger);
          text-shadow: 0 0 20px rgba(255, 42, 77, 0.4);
          line-height: 1;
        }

        .warning-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }

        .active-actions {
          display: flex;
          gap: 0.75rem;
          width: 100%;
        }

        .btn-cancel-timer {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--glass-border);
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          font-weight: 600;
        }

        .btn-panic-now {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: var(--sos-danger);
          color: white;
          border: none;
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          font-weight: 600;
        }

        .pin-pad {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: rgba(0,0,0,0.2);
          padding: 1rem;
          border-radius: var(--radius-sm);
        }
        .pin-pad p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          text-align: center;
        }
        .pin-pad input {
          font-size: 2rem;
          letter-spacing: 0.5rem;
          text-align: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--glass-border);
          color: white;
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          outline: none;
        }
        .pin-pad input:focus {
          border-color: var(--sos-info);
        }

        .pin-actions {
          display: flex;
          gap: 0.75rem;
        }
        .btn-secondary {
          flex: 1;
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          background: rgba(255,255,255,0.1);
          color: white;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
