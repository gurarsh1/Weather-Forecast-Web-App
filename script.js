// MODE SCRIPT
const modeToggle = document.getElementById("togglemode");

// Function to apply theme
function applyTheme(theme) {
    if (theme === "dark") {
        // body background
        document.body.style.background =
            "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)";

        // weather cards
        document.querySelectorAll(".weather-card").forEach((card) => {
            card.style.background =
                "linear-gradient(135deg, #2d2b55 0%, #443e8a 50%, #0f3460 100%)";
            card.style.color = "white";
        });

        // text colors
        document.querySelectorAll("h1, h2, .description, .temperature , .detail-value , .detail-label , .card-title , .weather-icon, .detail i ").forEach(
            (el) => {
                el.style.color = "#457b9d";
            }
        );

        // save in localStorage
        localStorage.setItem("theme", "dark");
        modeToggle.checked = true;
    }
    else {
        // light theme body
        document.body.style.background =
            "linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)";

        // light theme cards
        document.querySelectorAll(".weather-card").forEach((card) => {
            card.style.background =
                "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)";
            card.style.color = "#2c3e50";
        });

        // text colors
        document.querySelectorAll("h1, h2, .description, .temperature").forEach(
            (el) => {
                el.style.color = "#2c3e50";
            }
        );

        localStorage.setItem("theme", "light");
        modeToggle.checked = false;
    }
}

// Toggle switch listener
modeToggle.addEventListener("change", () => {
    if (modeToggle.checked) {
        applyTheme("dark");
    } else {
        applyTheme("light");
    }
});

// On page load: check localStorage
window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);
});

//fetching weather report



const api_Key = "9614f0cee5a24e199ed110810252608";

async function weather_report(cityFromStorage = null) {
    const cityInput = document.getElementById("city_name");
    const city = cityFromStorage || cityInput.value.trim();

    if (!city) {
        alert("Please enter a city name");
        return;
    }

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${api_Key}&q=${city}&days=7`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            alert("City not found or API error");
            return;
        }

        const data = await response.json();
        console.log(data);

        // Save last search in localStorage
        localStorage.setItem("lastCity", data.location.name);

        // Today’s card
        // ----------------
        const today = data.current;
        document.querySelector(".today .location h2").innerText = `${data.location.name}, ${data.location.country}`;

        const maxTemp = document.querySelector(".today .maxtemp");
        const minTemp = document.querySelector(".today .mintemp");

        maxTemp.innerText = `Max: ${today.temp_c}°C`;
        minTemp.innerText = `Min: ${today.temp_f}°C`;

        maxTemp.style.color = "#e63946";
        minTemp.style.color = "#457b9d";
        document.querySelector(".today .description").innerText = today.condition.text;
        document.querySelector(".today .weather-icon").innerHTML =
            `<img src="https:${today.condition.icon}" alt="Weather Icon">`;
        document.querySelector(".today .detail:nth-child(1) .detail-value").innerText = `${today.wind_kph} km/h`;
        document.querySelector(".today .detail:nth-child(2) .detail-value").innerText = `${today.humidity}%`;

        // ----------------
        // Tomorrow’s card
        // ----------------
        const tomorrow = data.forecast.forecastday[1];
        document.querySelector(".tomorrow .location h2").innerText = `${data.location.name}, ${data.location.country}`;

        const maxTempEl = document.querySelector(".tomorrow .maxtemp");
        const minTempEl = document.querySelector(".tomorrow .mintemp");

        maxTempEl.innerText = `Max: ${tomorrow.day.maxtemp_c}°C`;
        minTempEl.innerText = `Min: ${tomorrow.day.mintemp_c}°C`;

        maxTempEl.style.color = "#e63946";
        minTempEl.style.color = "#457b9d";


        document.querySelector(".tomorrow .description").innerText = tomorrow.day.condition.text;
        document.querySelector(".tomorrow .weather-icon").innerHTML =
            `<img src="https:${tomorrow.day.condition.icon}" alt="Weather Icon">`;
        document.querySelector(".tomorrow .detail:nth-child(1) .detail-value").innerText = `${tomorrow.day.maxwind_kph} km/h`;
        document.querySelector(".tomorrow .detail:nth-child(2) .detail-value").innerText = `${tomorrow.day.avghumidity}%`;


        //weekend outlookweekend 

        const day3 = data.forecast.forecastday[2];
        document.querySelector(".weekend .location h2").innerText = `${data.location.name}, ${data.location.country}`;

        const maxTempDay3 = document.querySelector(".weekend  .maxtemp");
        const minTempDay3 = document.querySelector(".weekend .mintemp");

        maxTempDay3.innerText = `Max: ${day3.day.maxtemp_c}°C`;
        minTempDay3.innerText = `Min: ${day3.day.mintemp_c}°C`;

        maxTempDay3.style.color = "#e63946";
        minTempDay3.style.color = "#457b9d";


        document.querySelector(".weekend .description").innerText = day3.day.condition.text;
        document.querySelector(".weekend .weather-icon").innerHTML =
            `<img src="https:${day3.day.condition.icon}" alt="Weather Icon">`;
        document.querySelector(".weekend .detail:nth-child(1) .detail-value").innerText = `${day3.day.maxwind_kph} km/h`;
        document.querySelector(".weekend .detail:nth-child(2) .detail-value").innerText = `${day3.day.avghumidity}%`;

    } catch (error) {
        console.error("Error fetching weather:", error);
        alert("Error fetching weather data");
    }
}

// Run search when button is clicked
document.querySelector(".search-box button").addEventListener("click", () => weather_report());

// Also run search when user presses ENTER inside input
document.getElementById("city_name").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        weather_report();
    }
});

// ✅ Load last searched city on page load
window.addEventListener("load", () => {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
        weather_report(lastCity);
    }
});




