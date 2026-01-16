// 🔊 SAFE CYBER BEEP (WILL NOT BLOCK JS)
let audioCtx;

function playCyberBeep() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = "square";
        oscillator.frequency.value = 900;

        gainNode.gain.value = 0.1;

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
        console.log("Audio blocked, skipping sound");
    }
}
// 🌦️ 1️⃣ City-based Weather
function getWeather(defaultCity) {

    // 🔊 sound (safe, non-blocking)
    playCyberBeep();

    const city = defaultCity || document.getElementById("cityInput").value;

    if (!city) {
        alert("Please enter a city name");
        return;
    }

    const url = `http://localhost:3000/weather?city=${city}`;

    fetch(url)
        .then(res => res.json())
        .then(data => displayWeather(data))
        .catch(err => {
            console.error(err);
            document.getElementById("weatherResult").innerText =
                "Error fetching data";
        });
}


// 📍 2️⃣ Location-based Weather (STEP 2.1 – YAHI HONA CHAHIYE)
function getLocationWeather() {
    navigator.geolocation.getCurrentPosition(
        position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const url = `http://localhost:3000/weather?lat=${lat}&lon=${lon}`;

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    displayWeather(data);
                })
                .catch(err => {
                    console.error(err);
                    alert("Unable to fetch location weather");
                });
        },
        error => {
            alert("Location permission denied");
        }
    );
}

// 🎨 3️⃣ Display + Theme + Temp Bar (STEP 1.2 + 3.3)
function displayWeather(data) {
    if (data.cod !== 200) {
        document.getElementById("weatherResult").innerText =
            "City not found";
        return;
    }

    // 🌙 Day / Night theme
    const iconCode = data.weather[0].icon;
    document.body.className = iconCode.includes("d") ? "day" : "night";

    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // 🌍 Country flag
    const country = data.sys.country.toLowerCase();
    const flagUrl = `https://flagcdn.com/w40/${country}.png`;

    // 🖼️ HTML update
    document.getElementById("weatherResult").innerHTML = `
        <h3>
            ${data.name}
            <img src="${flagUrl}" style="width:22px;vertical-align:middle;">
        </h3>
        <img src="${iconUrl}">
        <p><b>Temperature:</b> ${data.main.temp} °C</p>
        <p><b>Condition:</b> ${data.weather[0].description}</p>
        <p><b>Humidity:</b> ${data.main.humidity}%</p>

        <div class="temp-bar">
            <div id="tempFill"></div>
        </div>
    `;

    // 🌡️ STEP 3.3: Temperature bar fill
    const tempPercent = Math.min((data.main.temp + 10) * 2, 100);
    document.getElementById("tempFill").style.width = tempPercent + "%";
}

// 🚀 Default load
window.onload = function () {
    getWeather("Delhi");
};
