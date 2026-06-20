# Antigravity Usage Bar

A premium, standalone desktop system tray widget for monitoring your Antigravity AI models quota. Built with TypeScript and Node.js.

## ✨ Premium Features

- 📊 **Real-time ASCII Progress Bars**: Visually track the remaining percentage of each model directly from your system tray menu (e.g., `[████████░░] 85%`).
- 🎨 **Dynamic Tray Icon**: The system tray icon automatically changes color based on your overall quota health:
  - 🟢 **Green**: Healthy quota (> 50%)
  - 🟠 **Orange**: Running low (20% - 50%)
  - 🔴 **Red**: Critical or Exhausted (< 20%)
  - 🔘 **Gray**: Offline or Not Logged In
- 🚀 **Quick Wakeup / Ping**: A dedicated button in the tray to silently trigger model wakeups, preventing your daily quota from going to waste.
- 🔌 **Smart Offline Mode**: Gracefully handles disconnected states or IDE closures by displaying an offline status instead of crashing.
- 📦 **100% Standalone**: Completely self-contained within the `ts-widget` folder using the official `antigravity-usage` NPM package.

## 🛠️ Requirements

- **Linux** (Tested with AppIndicator/GTK System Trays)
- **Node.js** (v18 or higher)
- **NPM**

## 🚀 Installation & Setup

1. Clone this repository to your local machine.
2. Navigate into the `ts-widget` directory:
   ```bash
   cd ts-widget
   ```
3. Install the required dependencies (including the core engine):
   ```bash
   npm install
   ```

## 🎮 How to Run

To start the system tray widget, simply run:

```bash
cd ts-widget
npm run dev
```

Look for the "A" icon in your system tray (usually top-right for GNOME or bottom-right for KDE/Cinnamon).

> **Note on Authentication:**
> If your IDE (e.g., VSCode with Antigravity extension) is currently running, the widget will automatically piggyback on the local connection. If your IDE is closed, you will need to log in manually via `npx antigravity-usage login` inside the `ts-widget` directory to fetch the quota from the cloud.

## 🏗️ Architecture

Originally built as a Python (PyQt6) script, this project has been fully migrated to a lightweight Node.js/TypeScript architecture using `systray2`. It features a custom slot-based menu update system to bypass common GTK dynamic array rendering issues on Linux.
