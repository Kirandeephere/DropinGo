import React, { useState } from "react";
import AddressForm from "./components/AddressForm";
import { getRouteToken, pollRouteStatus } from "./services/api";
import MapView from "./components/MapView";
import { LoadScript } from "@react-google-maps/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [abortController, setAbortController] = useState(null);

  const handleFormSubmit = async ({ origin, destination }) => {
    const controller = new AbortController();
    setAbortController(controller);

    setLoading(true);
    setToken(null);
    setRouteData(null);

    try {
      const resultToken = await getRouteToken(
        origin,
        destination,
        controller.signal
      );
      setToken(resultToken);

      const route = await pollRouteStatus(resultToken, controller.signal);
      setRouteData(route);

      console.log("Route data:", route);
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Request was aborted");
        toast.info(" Route request canceled.");
      } else if (err.message.includes("Location not accessible")) {
        toast.error(" The destination is not accessible by car.");
      } else if (err.message.includes("Server error")) {
        toast.error(" A server error occurred. Please try again later.");
      } else if (err.message.includes("Max retries")) {
        toast.error(" Unable to get route. Please try again in a moment.");
      } else {
        toast.error(" Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
    }

    setLoading(false);
    setToken(null);
    setRouteData(null);
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={["places"]}
    >
      <div className="app-container">
        <h1>DropinGo – Pin It. Drop It. Go.</h1>

        <div className="content-layout">
          {/* Left panel */}
          <div className="info-panel">
            <AddressForm
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
              isSubmitting={loading}
            />

            {loading && (
              <div className="loading-container">
                <p className="loading-text">
                  Planning route
                  <span className="animated-dots">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </p>
              </div>
            )}

            {routeData && (
              <div className="route-info">
                <p>Route Information: </p>
                <div className="summary-item">
                  <span className="summary-label">📏 Distance: </span>
                  <span className="summary-value">
                    {(routeData.total_distance / 1000).toFixed(1)} km
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">🕒 Estimated Time: </span>
                  <span className="summary-value">
                    {Math.round(routeData.total_time / 60)} mins
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="map-panel">
            <MapView waypoints={routeData?.path || []} />
          </div>
        </div>

        {/* Toast container for user notifications */}
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </LoadScript>
  );
};

export default App;
