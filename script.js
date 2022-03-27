const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY ='49cc8c821cd2aff9af04c9f98c36eb74';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]

}, 1000);

getWeatherData()

function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
        
        let {latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

        showWeatherData(data);

        })

    })
}

function showWeatherData (data){
    let {humidity,  sunrise, sunset, wind_speed, feels_like, temp} = data.current;

    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + data.lon+'E'

    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
    <div>Temperature</div>
    <div>${Math.round(temp)} &#176;C</div>
    </div>
    <div class="weather-item">
    <div>Feels like</div>
    <div>${Math.round(feels_like)}%</div>
    </div>
    <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed} km/h</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>
    
    
    `;

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if (idx == 0) {
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">Low  ${Math.round(day.temp.min)}&#176;C</div>
                <div class="temp">High  ${Math.round(day.temp.max)}&#176;C</div>
            </div>
            
            `
        } else{
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Low  ${Math.round(day.temp.min)}&#176;C</div>
                <div class="temp">High  ${Math.round(day.temp.max)}&#176;C</div>
            </div>
            
            `
        }
    })


    weatherForecastEl.innerHTML = otherDayForcast;

    console.log(data.current)

    now = Date.now();
    console.log(now)

    // Set background 
    if (data.current.weather[0].main == "Clear" && (now > data.current.sunrise || now < data.current.sunset)){
        document.body.style.backgroundImage = "url('assets/sunny.jpg')";
    }
    else if (data.current.weather[0].main == "Clear" && (now < data.current.sunrise || now > data.current.sunset)){
        document.body.style.backgroundImage = "url('assets/clear_night.jpg')";
    }

    else if (data.current.weather[0].main == "Drizzle" || data.current.weather[0].main == "Rain"){
        document.body.style.backgroundImage = "url('assets/rainy.jpg')";
    }

    else if (data.current.weather[0].main == "Snow" && (now > data.current.sunrise || now < data.current.sunset)){
        document.body.style.backgroundImage = "url('assets/snow_day.jpg')";
    }

    else if (data.current.weather[0].main == "Snow" && (now < data.current.sunrise || now > data.current.sunset)){
        document.body.style.backgroundImage = "url('assets/snow_night.jpg')";
    }

    else if (data.current.weather[0].main == "Thunderstorm"){
        document.body.style.backgroundImage = "url('assets/thunder.jpg')";
    }

    else if (data.current.weather[0].main == "Clouds" && (now > data.current.sunrise || now < data.current.sunset)){
        document.body.style.backgroundImage = "url('assets/cloudy_day.jpg')";
    }

    else if (data.current.weather[0].main == "Clouds" && (now < data.current.sunrise || now > data.current.sunset)){
        document.body.style.backgroundImage = "url('assets/cloudy_night.webp')";
    }

    else {
        document.body.style.backgroundImage = "url('assets/sunny.jpg')";
    }
}