const modeToggle = document.getElementById("togglemode");

function applyTheme(theme) {
    if (theme === "dark") {
        document.body.style.background =
            "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)";

        document.querySelectorAll(".weather-card").forEach((card) => {
            card.style.background =
                "linear-gradient(135deg, #2d2b55 0%, #443e8a 50%, #0f3460 100%)";
            card.style.color = "white";
        });

        document.querySelectorAll("h1, h2, .description, .temperature , .detail-value , .detail-label , .card-title , .weather-icon, .detail i ").forEach(
            (el) => {
                el.style.color = "white";
            }
        );

        localStorage.setItem("theme", "dark");
        modeToggle.checked = true;
    }
    else {
        document.body.style.background =
            "linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)";

        document.querySelectorAll(".weather-card").forEach((card) => {
            card.style.background =
                "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)";
            card.style.color = "#2c3e50";
        });

        document.querySelectorAll("h1, h2, .description, .temperature").forEach(
            (el) => {
                el.style.color = "#2c3e50";
            }
        );

        localStorage.setItem("theme", "light");
        modeToggle.checked = false;
    }
}

modeToggle.addEventListener("change", () => {
    if (modeToggle.checked) {
        applyTheme("dark");
    } else {
        applyTheme("light");
    }
});

window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);
});

// --------------------------------------------------------------------------------------------------------------------------

const api_Key = "9614f0cee5a24e199ed110810252608";

async function weather_report() {

    const city = localStorage.getItem("lastCity");

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${api_Key}&q=${city}&days=8`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error("City not found or API error", response.statusText);
            return;
        }

        const data = await response.json();
        const forecastDays = data.forecast.forecastday;
        const cards = document.querySelectorAll(".w-detail");

        forecastDays.forEach((day, i) => {
            if (!cards[i]) return;
            const card = cards[i];
            const date = new Date(day.date);
            const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
            const dayNum = date.getDate();

            card.querySelector("summary .day").textContent = `${weekday}${dayNum}`;
            card.querySelector("summary .temp").innerHTML = `${day.day.maxtemp_c}°/${day.day.mintemp_c}°`;
            card.querySelector("summary .precipitation").innerHTML =
                `<i class="fas fa-tint"></i>${day.day.daily_chance_of_rain}%`;
            card.querySelector("summary .weather-icon").innerHTML =
                `<img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">`;

            card.querySelector(".content-header .left .temp").innerHTML = `${day.day.avgtemp_c}°`;
            card.querySelector(".content-header .left .weather-icon").innerHTML =
                `<img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">`;

            const right = card.querySelector(".content-header .right");
            if (right) {
                const precip = right.querySelector(".precipitation");
                if (precip) precip.textContent = `${day.day.daily_chance_of_rain}%`;

                const wind = right.querySelector(".wind-speed");
                if (wind) wind.textContent = `${day.day.maxwind_kph} km/h`;
            }

            const p = card.querySelector(".content p");
            if (p) {
                p.textContent = `${day.day.condition.text}. High ${day.day.maxtemp_c}°C / Low ${day.day.mintemp_c}°C. Wind up to ${day.day.maxwind_kph} km/h.`;
            }

            const humidity = card.querySelector(".humidity .data");
            if (humidity) humidity.textContent = `${day.day.avghumidity}%`;

            const uv = card.querySelector(".uv-index .data");
            if (uv) uv.textContent = day.day.uv;

            const sunrise = card.querySelector(".sunrise .data");
            if (sunrise) sunrise.textContent = day.astro.sunrise;

            const sunset = card.querySelector(".sunset .data");
            if (sunset) sunset.textContent = day.astro.sunset;
        });
    } catch (error) {
        console.error("Error fetching weather:", error);
    }
}

document.addEventListener("DOMContentLoaded", weather_report);