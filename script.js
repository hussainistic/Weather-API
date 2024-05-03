function getWeather() {
    const city = document.getElementById("citySelect").value.trim();
    if (city === "") {
        alert("Please select a city.");
        return;
    }

    const timestamp = new Date().getTime(); // Get current timestamp
    const apiUrl = `http://www.7timer.info/bin/civillight.php?lon=0&lat=0&ac=0&unit=metric&output=json&tzshift=0&city=${encodeURIComponent(city)}&timestamp=${timestamp}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert("Failed to fetch weather data. Please try again later.");
        });
}

function displayWeather(data) {
    const weatherResults = document.getElementById("weatherResults");
    weatherResults.innerHTML = "";

    if (data.dataseries && data.dataseries.length > 0) {
        const forecast = data.dataseries.slice(0, 7); 
        forecast.forEach(day => {
            const date = new Date(day.time * 1000); 
            const formattedDate = formatDate(date); 
            const weather = day.weather;

            const weatherCard = document.createElement("div");
            weatherCard.classList.add("weather-card");
            weatherCard.innerHTML = `
                <h3>${formattedDate}</h3>
                <p>Temperature: ${day.temp2m.min}°C - ${day.temp2m.max}°C</p>
                <p>Weather: ${weather}</p>
            `;
            weatherResults.appendChild(weatherCard);
        });
    } else {
        weatherResults.innerHTML = "<p>No weather data available for this city.</p>";
    }
}

function formatDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

document.getElementById("citySelect").addEventListener("change", function() {
    document.getElementById("weatherResults").innerHTML = "";
});
