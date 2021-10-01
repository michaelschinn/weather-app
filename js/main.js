//const { default: axios } = require("axios");
const App = document.getElementById('App');
function init(){
    setState(0);
    App.apiKey = "dcda06bf12abf7a7d0e5a9ff6149fcaf";
}

function setState(state){
    App.state = state;
    onStateChange();
}

function onStateChange(){
    switch(App.state){
        case 0 : 
            initUi();
        case 1 :
            if(App.zipcode.value !== ''){
                apiGet();
            }
    }
}

function getTime(){
    App.date = new Date();
    App.hours = App.date.getHours();
    App.minutes = App.date.getMinutes();
    App.seconds = App.date.getSeconds();
    App.currentTime = `${App.hours}:${App.minutes}`;
    
    App.month = App.date.getMonth();
    App.day = App.date.getDate();
    App.year = App.date.getFullYear();
    App.months = ['January, February, March, April, May, June, July, August, September, October, November, December'];
    App.currentDate = `${App.months[App.month]} ${App.day}, ${App.year}`;
}

function initUi(){
    App.zipcode = document.getElementById('zipCode');
    App.submitBtn = document.getElementById('submit');
    App.responseBox = document.getElementById('response');
    App.city = document.getElementById('city');
    App.tempK = document.getElementById('tempK');
    App.tempF = document.getElementById('tempF');
    App.tempC = document.getElementById('tempC');
    App.condition = document.getElementById('condition');
    App.otherInfo = document.getElementById('otherInfo');
    bindEvents();
}

function bindEvents(){
    App.submitBtn.addEventListener('click', () => {
        apiGet();
    });
    App.zipcode.addEventListener('keydown', e =>  {
        switch (e.key){
            case "Enter":
                console.log('Enter key_down');
                apiGet();
        }
    })
}

function validZipcode(zipcode){
    if (zipcode.length === 5 && zipcode !== 00000){
        return true;
    }
}

function apiGet(){
    if(validZipcode(App.zipcode.value) === true){
        axios.get(`http://api.openweathermap.org/data/2.5/weather?zip=${App.zipcode.value},us&appid=${App.apiKey}`).
            then((response) => {
                App.weather = response;
                console.log(App.weather);
                update();
            }).catch(error => {

                console.log(error)
            });
    }
}

function update(){
    App.city.textContent = App.weather.data.name;
    App.tempK.textContent = `${App.weather.data.main.temp} °K`;
    App.tempF.textContent = tempToF(App.weather.data.main.temp);
    App.tempC.textContent = tempToC(App.weather.data.main.temp);
    App,condition.textContent = App.weather.data.weather[0].description;
    App.otherInfo.innerHTML = 
        `Wind Speed: ${App.weather.data.wind.speed} mph<br>
        Pressure: ${App.weather.data.main.pressure} mb<br>
        Humidity: ${App.weather.data.main.humidity}%<br>
        Feels Like: ${App.weather.data.main.feels_like} °K, ${tempToF(App.weather.data.main.feels_like)}, ${tempToC(App.weather.data.main.feels_like)}`;
    //classSwap(App.response,"d-none","d-block");
}

function round(value, decimals){
    return Number(Math.round(value+'e'+decimals)+ 'e-'+decimals);
}

function tempToF(temp){
    return `${((temp - 273.15) * (9/5) + 32).toFixed(2)}°F`;
}

function tempToC(temp){
    return `${(temp - 273.15).toFixed(2)} °C`;
}

function classSwap(element, first, last){
    if(element.contains(first)){
        element.remove(first).add(last);
    }  
}

init()