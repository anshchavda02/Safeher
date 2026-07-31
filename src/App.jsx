import { useState, useEffect } from 'react'
import SOSButton from './components/SOSButton'
import ActionGrid from './components/ActionGrid'
import LocationTracker from './components/LocationTracker'
import EmergencyContacts from './components/EmergencyContacts'
import CheckInTimer from './components/CheckInTimer'
import CalculatorCamouflage from './components/CalculatorCamouflage'
import { EyeOff } from 'lucide-react'

function App() {
  const [isEmergency, setIsEmergency] = useState(false)
  const [locationUrl, setLocationUrl] = useState('')
  const [isCamouflaged, setIsCamouflaged] = useState(false)

  useEffect(() => {
    // Toggle body class for global emergency styling across all components
    if (isEmergency) {
      document.body.classList.add('emergency-mode');
    } else {
      document.body.classList.remove('emergency-mode');
    }
  }, [isEmergency]);

  const handleEmergencyMessage = (msg) => {
    try {
      const saved = localStorage.getItem('sos_contacts');
      const contacts = saved ? JSON.parse(saved) : [];
      const phones = contacts.map(c => c.phone).filter(Boolean).join(','); 
      
      const fullMessage = `${msg}! Please help me. My location: ${locationUrl || 'Unable to fetch'}`;
      
      setIsEmergency(true);

      if (phones) {
        window.location.href = `sms:${phones}?body=${encodeURIComponent(fullMessage)}`;
      } else {
        alert("Emergency Message Generated:\n\n" + fullMessage + "\n\n(No trusted contacts added!)");
      }
    } catch (e) {
      console.error("Failed to generate emergency sms intent:", e);
    }
  };

  if (isCamouflaged) {
    return <CalculatorCamouflage onExit={() => setIsCamouflaged(false)} />;
  }

  return (
    <>
      <header className="app-header animate-slide-up">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/logo.png" alt="SafeHer Logo" className="app-logo" />
          <h1 className="app-title text-gradient">SafeHer</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => setIsCamouflaged(true)} 
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
            title="Safe Mode"
          >
            <EyeOff size={20} />
          </button>
          <div className={`status-badge ${isEmergency ? 'danger' : 'safe'}`}>
            {isEmergency ? 'EMERGENCY MODE' : 'Standby'}
          </div>
        </div>
        <style>{`
          .status-badge {
            font-size: 0.75rem;
            font-weight: 800;
            padding: 0.4rem 0.8rem;
            border-radius: var(--radius-pill);
            text-transform: uppercase;
            letter-spacing: 1px;
            animation: fadeIn 0.5s ease;
          }
          .status-badge.danger {
            background: rgba(255, 42, 77, 0.15);
            color: #ff4d6d;
            border: 1px solid rgba(255, 42, 77, 0.3);
            animation: pulseWarning 2s infinite;
          }
          .status-badge.safe {
            background: rgba(16, 185, 129, 0.15);
            color: #34d399;
            border: 1px solid rgba(16, 185, 129, 0.3);
          }
          @keyframes pulseWarning {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 42, 77, 0.4); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); box-shadow: 0 0 0 10px rgba(255, 42, 77, 0); }
          }
        `}</style>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
        
        {/* Step 1: Main SOS Button */}
        <SOSButton 
          isEmergency={isEmergency} 
          toggleEmergency={() => {
            if (!isEmergency) {
              handleEmergencyMessage("EMERGENCY");
            } else {
              setIsEmergency(false);
            }
          }} 
          onMessageSelect={handleEmergencyMessage}
        />

        {/* Check-In Timer (Dead Man's Switch) */}
        {/* Only show if not actively in emergency state, to keep UI clean during panic */}
        {!isEmergency && <CheckInTimer onTimerExpire={handleEmergencyMessage} />}

        {/* Step 2: Instant Actions (Police, Ambulance, Fake Call, Siren) */}
        <ActionGrid />

        {/* Step 3: Location Tracking */}
        <LocationTracker onLocationUpdate={setLocationUrl} />

        {/* Step 4: Trusted Contacts */}
        <EmergencyContacts locationUrl={locationUrl} />

      </main>
    </>
  )
}

export default App
