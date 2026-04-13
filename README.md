# 🏎️ Legendary Motorsport | Car MarketPlace

**A High-Fidelity "Grand Theft Auto V" Style Automotive Discovery Platform.**

Welcome to the premium destination for the high-end driver. This project is a functional, real-time car marketplace web application designed with the aesthetic of the "Legendary Motorsport" website from GTA V. It connects multiple live APIs to provide a dynamic, game-like experience for discovering and "purchasing" luxury vehicles.

## 🌟 Key Features

- **🎮 GTA V "Legendary Motorsport" UI**: A pixel-perfect recreation of the iconic in-game browser window, including navigation controls, a URL bar, and a functional banking HUD.
- **📡 Live API Synchronization**:
    - **NHTSA VPIC API**: Dynamically retrieves the latest and most relevant models for any requested automotive brand.
    - **Marketcheck API**: Fetches real-time, active marketplace listings to compute accurate average market values.
- **📊 Technical Performance Engine**: Automatically generates stylized performance statistics (Top Speed, Acceleration, Braking, Traction) based on a vehicle's market value.
- **🏦 Simulated Banking System**: Features a functional "Order" system that updates your virtual bank account balance in real-time, complete with "Sold Out" state management.
- **⚡ Technical Specifications Grid**: Detailed technical data for every listing, including Transmission, Engine Size, MPG (City/Hwy), and Interior/Exterior color mapping.

## 🚀 Tech Stack

- **HTML5 & CSS3**: Custom vanilla CSS architecture (no frameworks) using HSL color mapping for the signature "Legendary Red" aesthetic.
- **Vanilla JavaScript (ES6+)**: Pure JS logic using async/await, modular exports, and advanced DOM manipulation.
- **RESTful API Integration**: Seamless handling of multiple external data sources with optimized fetch cycles.

## 🛠️ Usage & Installation

1. **API Key Setup**: Ensure your `config.js` is populated with a valid Marketcheck API Key.
   ```javascript
   export const API_KEY = "YOUR_MARKETCHECK_API_KEY";
   ```
2. **Local Run**: Open `index.html` in any modern browser. 
   *(Note: Since this project uses ES6 Modules, it is recommended to run via a local server like `Live Server` or `python -m http.server` to avoid CORS blocks.)*


**Project Status**: Production Ready / GTA UI Finalized
