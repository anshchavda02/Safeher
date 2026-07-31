import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Navigation, Share2, AlertCircle } from 'lucide-react';

export default function LocationTracker({ onLocationUpdate }) {
  const [location, setLocation] = useState(null);
  const [routeHistory, setRouteHistory] = useState([]);
  const [error, setError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isWalkWithMe, setIsWalkWithMe] = useState(false);

  useEffect(() => {
    let watchId;

    const startTracking = () => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        return;
      }

      setIsTracking(true);
      setError(null);

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          
          setLocation(newLoc);
          
          setRouteHistory(prev => {
            // Only add if it's the first point OR if user moved > ~10 meters
            // very rough distance check to avoid cluttering history while stationary
            if (prev.length === 0) return [newLoc];
            
            const lastLoc = prev[prev.length - 1];
            const dLat = Math.abs(newLoc.lat - lastLoc.lat);
            const dLng = Math.abs(newLoc.lng - lastLoc.lng);
            
            // roughly 0.0001 degrees is ~11 meters
            if (dLat > 0.0001 || dLng > 0.0001) {
               // Keep max 10 breadcrumbs
               const updated = [...prev, newLoc];
               if (updated.length > 10) updated.shift();
               return updated;
            }
            return prev;
          });

          setError(null);
        },
        (err) => {
          setError(err.message);
          // Don't turn off tracking on error, sometimes GPS just blips momentarily
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    };

    startTracking();

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const getMapsUrl = useCallback(() => {
    if (!location) return '';
    if (routeHistory.length <= 1) {
      return `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    }
    
    // Create a multi-waypoint dir URL for a breadcrumb visually connected path
    const origin = `${routeHistory[0].lat},${routeHistory[0].lng}`;
    const destination = `${location.lat},${location.lng}`;
    const waypoints = routeHistory.slice(1, routeHistory.length - 1)
      .map(p => `${p.lat},${p.lng}`)
      .join('|');
      
    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`;
    if (waypoints) {
      url += `&waypoints=${waypoints}`;
    }
    return url;
  }, [location, routeHistory]);

  useEffect(() => {
    if (location && onLocationUpdate) {
      onLocationUpdate(getMapsUrl());
    }
  }, [location, getMapsUrl, onLocationUpdate]);

  const handleShare = async () => {
    const url = getMapsUrl();
    if (!url) return;

    const shareData = {
      title: 'Emergency: My Location',
      text: 'I need help! Here is my current location:',
      url: url
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert('Location link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing location', err);
    }
  };

  return (
    <div className="location-panel glass-panel animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <div className="location-header">
        <div className="header-title">
          <Navigation size={20} className={isTracking || isWalkWithMe ? 'pulsing-icon' : ''} color={isWalkWithMe ? '#34d399' : (isTracking ? 'var(--sos-info)' : 'var(--text-secondary)')} />
          <h3>{isWalkWithMe ? 'Walk With Me Mode' : 'Live Location'}</h3>
        </div>
        {isTracking && <span className="status-badge safe mini" style={isWalkWithMe ? {background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16,185,129,0.5)', color: '#34d399'} : {}}>{isWalkWithMe ? 'Walking' : 'Active'}</span>}
      </div>

      <div className="location-content">
        {error ? (
          <div className="error-message">
            <AlertCircle size={18} color="var(--sos-warning)" />
            <p>{error}. Please enable location permissions.</p>
          </div>
        ) : location ? (
          <>
            <div className="coordinates">
              <div className="coord-box">
                <span className="label">LATITUDE</span>
                <span className="value">{location.lat.toFixed(5)}°</span>
              </div>
              <div className="coord-box">
                <span className="label">LONGITUDE</span>
                <span className="value">{location.lng.toFixed(5)}°</span>
              </div>
            </div>
            <div className="accuracy-info">
              Accuracy: within {Math.round(location.accuracy)} meters
              {routeHistory.length > 1 && ` • Tracking ${routeHistory.length} route points`}
            </div>
            <div className="location-actions">
              <a 
                href={getMapsUrl()} 
                target="_blank" 
                rel="noreferrer" 
                className="btn-map"
              >
                <MapPin size={18} />
                Map
              </a>
              <button onClick={handleShare} className="btn-share">
                <Share2 size={18} />
                Share
              </button>
              <button 
                onClick={() => {
                  if (!isWalkWithMe) {
                    alert("Walk With Me Active! Share your link with a contact now.");
                  }
                  setIsWalkWithMe(!isWalkWithMe);
                }} 
                className="btn-share"
                style={{
                  background: isWalkWithMe ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                  color: isWalkWithMe ? '#34d399' : 'white',
                  borderColor: isWalkWithMe ? 'rgba(16, 185, 129, 0.4)' : 'var(--glass-border)'
                }}
              >
                <Navigation size={18} />
                {isWalkWithMe ? 'Stop' : 'Walk'}
              </button>
            </div>
          </>
        ) : (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Acquiring GPS signal...</p>
          </div>
        )}
      </div>

      <style>{`
        .location-panel {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .location-header {
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

        .pulsing-icon {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 0.5; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.5; transform: scale(0.9); }
        }

        .status-badge.mini {
          font-size: 0.7rem;
          padding: 0.2rem 0.5rem;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
          background: rgba(245, 158, 11, 0.1);
          padding: 1rem;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .coordinates {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .coord-box {
          flex: 1;
          background: rgba(0,0,0,0.2);
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .coord-box .label {
          font-size: 0.65rem;
          color: var(--text-secondary);
          font-weight: 700;
          letter-spacing: 1px;
        }

        .coord-box .value {
          font-size: 1.2rem;
          font-weight: 600;
          font-family: monospace;
          color: var(--sos-info);
        }

        .accuracy-info {
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-align: center;
          margin-bottom: 1rem;
        }

        .location-actions {
          display: flex;
          gap: 0.75rem;
        }

        .btn-map, .btn-share {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-map {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .btn-share {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--glass-border);
          color: var(--text-primary);
        }

        .btn-map:hover, .btn-share:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 2rem 0;
          color: var(--text-secondary);
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255,255,255,0.1);
          border-top-color: var(--sos-info);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
