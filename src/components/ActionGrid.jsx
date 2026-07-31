import React, { useState, useEffect } from 'react';
import { Phone, PhoneIncoming, Siren, ShieldAlert } from 'lucide-react';
import FakeCallScreen from './FakeCallScreen';

export default function ActionGrid() {
  const [isPlayingSiren, setIsPlayingSiren] = useState(false);
  const [showFakeCallScreen, setShowFakeCallScreen] = useState(false);
  const [isFakeCallActive, setIsFakeCallActive] = useState(false);

  useEffect(() => {
    if (!isPlayingSiren) return;

    // We create a generic loud alarm sound since we can't bundle a real mp3 easily here.
    // In a real app, this would be `new Audio('/siren.mp3')`.
    // We'll use the Web Audio API to synthesize a harsh siren.
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const oscillator2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'square';
    oscillator2.type = 'sawtooth';
    
    oscillator.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    // LFO for the wailing effect
    const lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 2; // 2Hz wail
    
    const modulationGain = audioCtx.createGain();
    modulationGain.gain.value = 400; // Frequency variation
    
    lfo.connect(modulationGain);
    modulationGain.connect(oscillator.frequency);
    modulationGain.connect(oscillator2.frequency);
    
    oscillator.frequency.value = 700; // Base frequency
    oscillator2.frequency.value = 750; // Slightly detuned

    gainNode.gain.value = 0.5;

    lfo.start();
    oscillator.start();
    oscillator2.start();

    // Cleanup function that stops the audio when isPlayingSiren becomes false
    // or when the component unmounts.
    return () => {
      oscillator.stop();
      oscillator2.stop();
      lfo.stop();
      audioCtx.close();
    };
  }, [isPlayingSiren]);

  const toggleSiren = () => {
    setIsPlayingSiren(!isPlayingSiren);
  };

  const triggerFakeCall = () => {
    if (showFakeCallScreen || isFakeCallActive) return;
    setIsFakeCallActive(true);
    alert("Incoming call simulated in 3 seconds...");
    setTimeout(() => {
      setIsFakeCallActive(false);
      setShowFakeCallScreen(true);
    }, 3000);
  };

  const actions = [
    {
      id: 'police',
      icon: <ShieldAlert size={28} />,
      label: 'Police',
      color: '#3b82f6', // Blue
      action: () => {
        window.location.href = 'tel:100';
      }
    },
    {
      id: 'ambulance',
      icon: <Phone size={28} />,
      label: 'Ambulance',
      color: '#f59e0b', // Orange/Amber
      action: () => {
        window.location.href = 'tel:102';
      }
    },
    {
      id: 'fake_call',
      icon: <PhoneIncoming size={28} />,
      label: 'Fake Call',
      color: '#8b5cf6', // Purple
      action: triggerFakeCall
    },
    {
      id: 'siren',
      icon: <Siren size={28} />,
      label: isPlayingSiren ? 'Stop Siren' : 'Siren',
      color: isPlayingSiren ? '#ff2a4d' : '#ec4899', // Pink
      action: toggleSiren,
      isActive: isPlayingSiren
    }
  ];

  return (
    <div className="action-grid animate-slide-up" style={{ animationDelay: '0.2s' }}>
      {actions.map((act) => (
        <button 
          key={act.id} 
          onClick={act.action}
          className={`action-btn glass-panel ${act.isActive ? 'active-siren' : ''}`}
          style={{ '--btn-color': act.color }}
        >
          <div className="icon-wrapper" style={{ color: act.color }}>
            {act.icon}
          </div>
          <span className="action-label">{act.label}</span>
        </button>
      ))}

      <style>{`
        .action-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.5rem 1rem;
          gap: 0.75rem;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          border-color: var(--btn-color);
        }

        .icon-wrapper {
          background: rgba(255, 255, 255, 0.05);
          padding: 1rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-label {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .active-siren {
          background: rgba(255, 42, 77, 0.2);
          border-color: rgba(255, 42, 77, 0.5);
          animation: flashBg 0.5s infinite alternate;
        }

        @keyframes flashBg {
          from { background: rgba(255, 42, 77, 0.1); }
          to { background: rgba(255, 42, 77, 0.3); }
        }
      `}</style>
      
      {showFakeCallScreen && <FakeCallScreen onDecline={() => setShowFakeCallScreen(false)} />}
    </div>
  );
}
