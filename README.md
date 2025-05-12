# DropinGo – Pin It. Drop It. Go.

DropinGo is a responsive React application that enables users to visualize driving routes between two locations with Google Places Autocomplete and an animated route display using Mapbox. It focuses on UX simplicity, interactive mapping, and real-time status polling.

## ✨ Features

* 📍 **Google Places Autocomplete** for origin and destination inputs
* 🧭 **Route generation** with polling logic using Lalamove mock API
* 🗺️ **Mapbox-powered animated route display**
* 🔁 **Swap** pickup and drop-off addresses
* ⚠️ **Error handling** with user-friendly toasts
* 💬 **Live route feedback** with distance and ETA
* 📱 **Responsive layout** for desktop and mobile
* ✅ **Bonus features**: Autocomplete, cancelable requests, animated map drawing


## 🧩 Tech Stack

* **React** with Hooks
* **@react-google-maps/api** for Google Autocomplete
* **Mapbox GL JS** for map and route visualization
* **React Toastify** for notifications
* **CSS / Custom styling** for layout and responsiveness

## 🛠️ How It Works

1. **Input Addresses**: Users enter pickup and drop-off locations using Google Autocomplete.
2. **Get Route**: On submission, the app fetches a route token via a POST request to the mock API.
3. **Poll Status**: It polls the API for the route’s availability (status: `success`) until a response is received or timeout occurs.
4. **Render Map**: When data is received, the route path is drawn on a Mapbox map with animated line drawing and numbered markers.
5. **Show Info**: Distance and estimated time are displayed on the left panel.

## 🧪 How to Run

### 1. Clone the Repo

```bash
git clone https://github.com/Kirandeephere/dropingo.git
cd dropingo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root with:

```bash
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_MAPBOX_TOKEN=your_mapbox_token
```

> Make sure your Google key has **Places API** enabled.

### 4. Run Locally

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
```

## 📁 Folder Structure

```
├── components/
│   ├── AddressForm.jsx     # Input form with Autocomplete and controls
│   └── MapView.jsx         # Mapbox map with animated route and markers
├── services/
│   └── api.js              # API logic for token and polling
├── App.jsx                 # Main app layout and logic
├── index.html              # Entry point
├── .env                    # Environment variables
```

## ⚠️ Known Limitations

* Currently uses mock API, not production-ready.
* Route polling timeout not user-configurable.
* Limited to driving routes only.

## 📄 License

This project is for demonstration purposes under the [MIT License](./LICENSE).
