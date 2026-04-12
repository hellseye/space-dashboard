# 🚘 Car MarketPlace

A modern, fast, and completely Vanilla Javascript web application for discovering live car models and computing their average market values in real-time. 

## ✨ Features

- **Blazing Fast Search**: Input any automotive make (e.g., *BMW, Honda, Toyota*) to dynamically fetch the newest models using the public NHTSA VPIC API.
- **Live Market Data**: Queries `api.marketcheck.com` to grab currently active marketplace listings, giving you real-world average pricing based on live data!
- **Async/Await Optimization**: Employs efficient concurrency resolving to gracefully iterate limits to avoid API throttling.
- **Glassmorphism UI**: A customized cutting-edge CSS architecture leveraging CSS Custom Properties (`var`), `backdrop-filters`, and complex inset `box-shadows`. No Tailwind or external UI libraries needed!

## 🚀 Tech Stack

- **HTML5** & **CSS3**
- **Vanilla JavaScript (ES6 Modules)**
- **NHTSA Vehicle API**
- **Marketcheck API**

## 🛠️ Installation & Setup

Because this app utilizes native ES6 JavaScript modules and imports, you can simply load it into your browser window (or run it statically using any basic web server).

1. Clone the repository locally.
2. Edit `.env` or `config.js` to insert your active **Marketcheck API Key**:
```javascript
// config.js
export const API_KEY = "your_personal_api_key_here";
```
3. Open `index.html` in your browser. (Since we are using ES modules `<script type="module">`, some browsers might require you to run it using a Live Server extension or `python -m http.server` so CORS isn't blocked locally).

## 💡 What I built

- Implemented **dynamic data binding** directly using JavaScript template strings.
- Processed arrays using robust logic blocks to slice, sanitize, and average nested structures.
- Connected multiple third-party **RESTful APIs** using asynchronous HTTP `fetch` handlers.
- Created beautiful hover states and DOM interactions.
