import React, { useState, useEffect } from 'react';
import { Users, Plus, Phone, Mail, Trash2, MessageSquare } from 'lucide-react';

export default function EmergencyContacts({ locationUrl }) {
  const [contacts, setContacts] = useState(() => {
    try {
      const saved = localStorage.getItem('sos_contacts');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Failed to load contacts", err);
      return [];
    }
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '' });

  // Save contacts to local storage
  useEffect(() => {
    try {
      localStorage.setItem('sos_contacts', JSON.stringify(contacts));
    } catch (err) {
      console.error("Failed to save contacts", err);
    }
  }, [contacts]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newContact.name || (!newContact.phone && !newContact.email)) {
      alert("Please provide a name and at least a phone number or email.");
      return;
    }
    
    setContacts([...contacts, { ...newContact, id: Date.now().toString() }]);
    setNewContact({ name: '', phone: '', email: '' });
    setIsAdding(false);
  };

  const handleRemove = (id) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const getSmsHref = (phone) => {
    const message = encodeURIComponent(`EMERGENCY! I need help. My location: ${locationUrl || 'Unable to fetch'}`);
    // This is simple formatting. On real mobile devices, ?body= or &body= varies by OS, 
    // but ?body= is standard enough for modern iOS/Android intents to launch SMS.
    return `sms:${phone}?body=${message}`;
  };

  const getMailHref = (email) => {
    const subject = encodeURIComponent("EMERGENCY: I Need Help");
    const body = encodeURIComponent(`I am using my SOS app and need immediate assistance.\n\nMy current location: ${locationUrl || 'Unable to fetch at this moment.'}\n\nPlease check on me!`);
    return `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="contacts-panel glass-panel animate-slide-up" style={{ animationDelay: '0.4s' }}>
      <div className="contacts-header">
        <div className="header-title">
          <Users size={20} color="var(--text-secondary)" />
          <h3>Trusted Contacts</h3>
        </div>
        <button 
          className="btn-add-contact" 
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus size={16} />
          {isAdding ? 'Cancel' : 'Add'}
        </button>
      </div>

      <div className="contacts-content">
        {isAdding && (
          <form onSubmit={handleAdd} className="add-contact-form">
            <input 
              type="text" 
              placeholder="Name" 
              value={newContact.name}
              onChange={e => setNewContact({...newContact, name: e.target.value})}
              required
            />
            <input 
              type="tel" 
              placeholder="Phone Number" 
              value={newContact.phone}
              onChange={e => setNewContact({...newContact, phone: e.target.value})}
            />
            <input 
              type="email" 
              placeholder="Email ID" 
              value={newContact.email}
              onChange={e => setNewContact({...newContact, email: e.target.value})}
            />
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Save Contact
            </button>
          </form>
        )}

        <div className="contacts-list">
          {contacts.length === 0 && !isAdding ? (
            <div className="empty-state">
              <p>No contacts added yet. Add trusted friends/family here to quickly alert them.</p>
            </div>
          ) : (
            contacts.map(contact => (
              <div key={contact.id} className="contact-card">
                <div className="contact-info">
                  <h4>{contact.name}</h4>
                  {(contact.phone || contact.email) && (
                    <span className="contact-details">
                      {contact.phone} {contact.phone && contact.email && '•'} {contact.email}
                    </span>
                  )}
                </div>
                <div className="contact-actions">
                  {contact.phone && (
                    <>
                      <a href={`tel:${contact.phone}`} className="action-circle phone" title="Call Contact">
                        <Phone size={16} />
                      </a>
                      <a href={getSmsHref(contact.phone)} className="action-circle sms" title="SMS Contact">
                        <MessageSquare size={16} />
                      </a>
                    </>
                  )}
                  {contact.email && (
                    <a href={getMailHref(contact.email)} className="action-circle email" title="Email Contact">
                      <Mail size={16} />
                    </a>
                  )}
                  <button onClick={() => handleRemove(contact.id)} className="action-circle delete" title="Delete Contact">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .contacts-panel {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .contacts-header {
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

        .btn-add-contact {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: rgba(255,255,255,0.1);
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 600;
        }

        .add-contact-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background: rgba(0,0,0,0.2);
          padding: 1rem;
          border-radius: var(--radius-sm);
          margin-bottom: 1rem;
        }

        .add-contact-form input {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--glass-border);
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          color: white;
          font-family: inherit;
          outline: none;
        }
        .add-contact-form input:focus {
          border-color: var(--sos-info);
        }

        .contacts-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .empty-state {
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.9rem;
          padding: 1rem 0;
        }

        .contact-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--glass-border);
          padding: 1rem;
          border-radius: var(--radius-md);
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .contact-info h4 {
          font-size: 1rem;
          font-weight: 600;
        }
        .contact-details {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .contact-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
        }
        .action-circle.phone {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
        }
        .action-circle.sms {
          background: rgba(168, 85, 247, 0.15);
          color: #c084fc;
        }
        .action-circle.email {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
        }
        .action-circle.delete {
          background: rgba(255, 42, 77, 0.15);
          color: #ff4d6d;
        }
        .action-circle:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
