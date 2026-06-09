import React, { useState, useEffect } from 'react';

import "./Weatherbar.css"

const API_KEY = "API/KEY"; 

const LEFT_CITIES = ["İstanbul", "Ankara"];
const RIGHT_CITIES = ["İzmir", "Balıkesir", "Bursa"];
const ALL_DEFAULT_CITIES = [...LEFT_CITIES, ...RIGHT_CITIES];

function Weatherbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeWeather, setActiveWeather] = useState(null);
  const [widgetsData, setWidgetsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hava durumu durumuna göre Premium FontAwesome ikon eşleştirici
  const getWeatherIcon = (main) => {
    switch (main) {
      case 'Clear': return 'fa-solid fa-sun';
      case 'Clouds': return 'fa-solid fa-cloud';
      case 'Rain': return 'fa-solid fa-cloud-showers-heavy';
      case 'Snow': return 'fa-solid fa-snowflake';
      case 'Thunderstorm': return 'fa-solid fa-cloud-bolt';
      case 'Drizzle': return 'fa-solid fa-cloud-rain';
      default: return 'fa-solid fa-cloud-sun';
    }
  };


  const fetchWeatherData = async (city) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=tr`
    );
    if (!response.ok) throw new Error(`${city} verisi alınamadı.`);
    return response.json();
  };

  useEffect(() => {
    if (API_KEY === "BURAYA_OPENWEATHER_API_KEY_YAZIN") {
      setError("Lütfen geçerli bir OpenWeather API Key tanımlayın.");
      setLoading(false);
      return;
    }

    async function loadInitialData() {
      try {
        const promises = ALL_DEFAULT_CITIES.map(city => fetchWeatherData(city));
        const results = await Promise.all(promises);
        
        const dataMap = {};
        results.forEach(data => {
          dataMap[data.name.toLowerCase()] = data;
        });

        setWidgetsData(dataMap);
      
        setActiveWeather(dataMap["i̇stanbul"] || results[0]);
        setLoading(false);
      } catch (err) {
        setError("Varsayılan hava durumu verileri yüklenirken teknik hata oluştu.");
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);


  const handleSearch = async (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (!searchQuery.trim()) return;
      setLoading(true);
      setError(null);
      try {
        const searchedData = await fetchWeatherData(searchQuery.trim());
        setActiveWeather(searchedData);
        setSearchQuery("");
      } catch (err) {
        setError("Şehir bulunamadı veya API hatası oluştu. Lütfen tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    }
  };


  const selectCityFromWidget = (cityName) => {
    const cacheData = widgetsData[cityName.toLowerCase()];
    if (cacheData) {
      setActiveWeather(cacheData);
    } else {

      setLoading(true);
      fetchWeatherData(cityName)
        .then(data => setActiveWeather(data))
        .catch(() => setError("Veri güncellenemedi."))
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="weather-wrapper">
      
  
      <header className="weather-header">
        
   
        <div className="header-widgets-group">
          {LEFT_CITIES.map(city => {
            const data = widgetsData[city.toLowerCase()];
            return (
              <div key={city} onClick={() => selectCityFromWidget(city)} className={`mini-widget-card ${activeWeather?.name.toLowerCase() === city.toLowerCase() ? "active-widget" : ""}`}>
                <span className="widget-city-name">{city}</span>
                <span className="widget-temp">{data ? `${Math.round(data.main.temp)}°C` : "--"}</span>
              </div>
            );
          })}
        </div>


        <div className="search-engine-box">
          <input 
            type="text" 
            placeholder="Şehir ismi giriniz..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="search-input-premium"
          />
          <button onClick={handleSearch} className="search-btn-premium">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>

 
        <div className="header-widgets-group">
          {RIGHT_CITIES.map(city => {
            const data = widgetsData[city.toLowerCase()];
            return (
              <div key={city} onClick={() => selectCityFromWidget(city)} className={`mini-widget-card ${activeWeather?.name.toLowerCase() === city.toLowerCase() ? "active-widget" : ""}`}>
                <span className="widget-city-name">{city}</span>
                <span className="widget-temp">{data ? `${Math.round(data.main.temp)}°C` : "--"}</span>
              </div>
            );
          })}
        </div>

      </header>


      <main className="weather-main-container">
        {loading && (
          <div className="weather-status-message">
            <i className="fa-solid fa-spinner fa-spin fa-2xl"></i> <p>Premium veri hatları senkronize ediliyor...</p>
          </div>
        )}

        {error && (
          <div className="weather-status-message error-glow">
            <i className="fa-solid fa-circle-exclamation fa-2xl"></i> <p>{error}</p>
          </div>
        )}

        {!loading && !error && activeWeather && (
          <div className="active-weather-display">
            
        
            <div className="display-core-row">
              <div className="core-info-left">
                <h1 className="active-city-title">{activeWeather.name}</h1>
                <p className="active-weather-desc">{activeWeather.weather[0].description.toUpperCase()}</p>
              </div>
              <div className="core-info-right">
                <i className={`${getWeatherIcon(activeWeather.weather[0].main)} active-weather-big-icon`}></i>
                <span className="active-main-temp">{Math.round(activeWeather.main.temp)}°C</span>
              </div>
            </div>

   
            <div className="metrics-dashboard-grid">
              
              <div className="metric-box-card">
                <div className="metric-icon-wrapper"><i className="fa-solid fa-temperature-half"></i></div>
                <div className="metric-data-wrapper">
                  <span className="metric-label">Hissedilen</span>
                  <span className="metric-value">{Math.round(activeWeather.main.feels_like)}°C</span>
                </div>
              </div>

              <div className="metric-box-card">
                <div className="metric-icon-wrapper"><i className="fa-solid fa-droplet"></i></div>
                <div className="metric-data-wrapper">
                  <span className="metric-label">Nem Oranı</span>
                  <span className="metric-value">%{activeWeather.main.humidity}</span>
                </div>
              </div>

              <div className="metric-box-card">
                <div className="metric-icon-wrapper"><i className="fa-solid fa-wind"></i></div>
                <div className="metric-data-wrapper">
                  <span className="metric-label">Rüzgar Hızı</span>
                  <span className="metric-value">{activeWeather.wind.speed} m/s</span>
                </div>
              </div>

              <div className="metric-box-card">
                <div className="metric-icon-wrapper"><i className="fa-solid fa-gauge"></i></div>
                <div className="metric-data-wrapper">
                  <span className="metric-label">Basınç</span>
                  <span className="metric-value">{activeWeather.main.pressure} hPa</span>
                </div>
              </div>

            </div>

          </div>
        )}
      </main>

    </div>
  );
}

export default Weatherbar;