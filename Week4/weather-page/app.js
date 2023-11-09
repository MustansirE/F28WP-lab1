const cityInputEl = document.getElementById('cityInput');
const submitButtonEl = document.getElementById('btn');
const weatherInfoEl = document.getElementById('weather-info');

submitButtonEl.addEventListener('click', () => {
    const cityName = cityInputEl.value.trim();

    if (cityName === '') {
        alert('Please enter a city name.');
    } else {
        const apiKey = 'a51df0bb142ba17a932e698c99449da2';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

        fetch(apiUrl)
            .then(response => {
                if (response.status !== 200) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const weatherDescription = data.weather[0].description;
                const cityTemperature = (data.main.temp - 273.15).toFixed(2);
                const windSpeed = data.wind.speed;
                weatherInfoEl.innerHTML += `
                    <p>The weather in ${cityName} is ${weatherDescription}</p>
                    <p>The temperature is ${cityTemperature}°C with a wind speed of ${windSpeed} m/s</p> 
                    <hr>
                `;
            })
            .catch(error => {
                if (error.name === 'TypeError') {
                    weatherInfoEl.innerHTML = 'Network error. Please check your internet connection.';
                } else {

                    weatherInfoEl.innerHTML = 'Error fetching weather data. Please try again later.';
                }
            });
    }
});