# SafeHer 🛡️

> **Personal Safety & Emergency SOS Progressive Web Application designed to protect, discreetly alert, and empower women in critical situations.**

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF.svg)](https://vitejs.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-green.svg)](https://web.dev/progressive-web-apps/)

---

## 📖 About SafeHer

**SafeHer** is a client-first, privacy-focused Progressive Web Application (PWA) created to provide rapid, discreet, and reliable emergency assistance. Designed specifically with women's safety in mind, SafeHer transforms any smartphone or browser into a personal security hub.

Whether walking home alone at night, taking a ride-share, or facing an active emergency, SafeHer equips users with immediate danger triggers, automated check-in countdown timers, discreet disguise interfaces, real-time GPS breadcrumb tracking, and instant alerts to trusted contacts and emergency services.

### 🌟 Core Philosophy
- **Speed & Simplicity**: Emergency actions require zero friction and minimal taps.
- **Privacy & Autonomy**: All contacts and settings are stored locally on your device via `localStorage`. No cloud tracking or external user databases.
- **Stealth & Discretion**: Built-in camouflage disguise modes ensure the user can switch away from an active safety interface instantly if threatened.

---

## ✨ Key Features

### 🔴 1. One-Tap & Radial SOS Trigger
- **Instant Emergency Mode**: Tap the main pulsing SOS button to activate visual emergency warnings and open pre-formatted SMS intents to all trusted contacts with your live location.
- **Gesture Radial Preset Menu**: Hold and drag over the SOS button to select specific emergency contexts:
  - 🚗 *"I'm in an accident"*
  - 🩹 *"I'm injured"*
  - 🏃 *"Someone is following me"*
  - 🚨 *"I'm abducted"*

### ⏱️ 2. Check-In Timer (Dead Man's Switch)
- Set a countdown (2, 5, 10, 15, or 30 minutes) before entering a potentially risky situation (e.g. late night taxi ride).
- If the countdown reaches zero without being cancelled using your secret PIN (`1234`), SafeHer automatically triggers full SOS emergency alerts.
- Features a **"Panic Now"** button for immediate activation.

### 📍 3. Live GPS & Breadcrumb Trail Location Tracking
- Real-time continuous geolocation tracking with accuracy readings.
- **Breadcrumb Trail**: Automatically logs location waypoints as you move and generates dynamic Google Maps multi-point route links.
- **Walk With Me Mode**: Share live location breadcrumb routes with friends or family while walking.
- One-touch location sharing via Web Share API or Clipboard fallback.

### 🥸 4. Calculator Camouflage (Discreet Mode)
- Disguises the entire app as a fully functional retro calculator interface (`112` or press-and-hold display to reveal the true safety app).
- Hides all emergency UI elements instantly from unwanted eyes.

### 📞 5. Instant Emergency Actions Grid
- **Police (100)** & **Ambulance (102)** direct dialers.
- **Fake Call Generator**: Simulates a realistic incoming call with ringing audio to give you an authentic excuse to exit unsafe environments.
- **Synthesized Loud Siren**: High-decibel wailing alarm synthesized via Web Audio API to deter attackers and attract public attention.

### 👥 6. Trusted Contacts Management
- Add trusted friends and family members with Name, Phone Number, and Email.
- Direct **Phone Call**, **SMS**, and **Email** quick action buttons for each contact with auto-filled GPS coordinates.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Core** | React 19, JavaScript (ES6+), HTML5 |
| **Build System & HMR** | Vite 7, `@vitejs/plugin-react` |
| **Styling & Aesthetics** | Modern Vanilla CSS, Glassmorphism design system, CSS Animations |
| **Icons** | Lucide React |
| **Offline & PWA** | `vite-plugin-pwa`, Workbox Service Workers |
| **Web APIs Used** | Geolocation API, Web Audio API, Web Share API, Vibration API, Web Storage API |

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18 or higher) and `npm` installed on your machine.

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/anshchavda02/Safeher.git
   cd Safeher
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173` (or the URL output in your terminal).

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Preview Production Build**
   ```bash
   npm run preview
   ```

---

## 📱 Discreet Controls & Default Credentials

| Feature | Default Trigger / Credential |
| :--- | :--- |
| **Camouflage Secret Code** | Type `112` and press `=` on the calculator display |
| **Camouflage Hold Exit** | Press and hold top display for 2 seconds |
| **Check-In Timer PIN** | `1234` |
| **SOS Radial Menu** | Hold down main SOS button for >450ms |

---

## 🔒 Security & Privacy Statement

SafeHer takes privacy seriously:
- **No Third-Party Servers**: No user data, locations, or contact lists are sent to external servers or backend databases.
- **Device Storage Only**: All trusted contacts remain encrypted in your device's browser `localStorage`.
- **Permission Controlled**: Geolocation and Web Audio access are strictly requested on-demand during active user interaction.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/anshchavda02/Safeher/issues).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
