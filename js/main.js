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
            App.responseTemplateSet = false;
        case 1 :
            if(App.zipcode.value !== ''){
                apiGet();
            }
    }
}

function defineTemplates(){
    App.topTemplate = `
        <div class="row">
            <div class="col"></div>
            <div class="col-12 col-md-8 col-lg-6 text-center pt-5 pl-4">
                <div class="input-group">
                    <input id="zipCode" class="form-control-lg" type="text" placeholder="zipcode">
                    <button id="submit" class="btn-lg btn bg-dark text-light">SUBMIT</button>
                </div>
            </div>
            
            <div class="col"></div>
        </div>
        <div class="row">
        <div class="col"></div><div id="error" class="col bg-danger text-white my-3"></div>
        <div class="col"></div></div>
    `;
    App.responseTemplate = `
        <div id="response" class="row pb-5 opacity-0">
            <div class="col"></div>
            <div class="col-12 col-md-8 col-lg-6">
                <div class="container">
                    <div class="card text-light">
                        <div class="card-body row">
                            <div class="container">
                                <div class="row pl-3 pb-3">
                                    <div id="dateDisplay" class="col-12 display-6"></div>
                                    <div id="timeDisplay" class="col-12 display-6"></div>
                                </div>
                                <div class="row pt-1 pl-3 border-top border-dark">
                                    <div id="tempF" class="col-12 display-1"></div>
                                </div>
                                <div class="row pb-3 pl-3">
                                    <div class="col">
                                        <span id="tempK"></span> | <span id="tempC"></span>
                                    </div>
                                </div>
                                <div class="row border-top border-dark pt-3 pl-3">
                                    <div id="city" class="col-12 card-text display-6"></div>
                                </div>
                                <div class="row border-bottom border-dark pb-3 pl-3">
                                    <div id="condition" class="col text-capitalize display-6"></div>
                                </div>
                                <div class="row pl-3 pt-3">
                                    <div id="status" class="col"></div>
                                </div>
                                <div class="row p-3">
                                    <div id="otherInfo" class="col"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col"></div>
        </div>
    `;
}

function initUi(){
    defineTemplates();
    App.innerHTML = App.topTemplate;
    App.zipcode = document.getElementById('zipCode');
    App.submitBtn = document.getElementById('submit');
    bindEvents();
}

function initWeatherUi(){
    App.responseBox = document.getElementById('response');
    App.timeDisplay = document.getElementById('timeDisplay');
    App.dateDisplay = document.getElementById('dateDisplay');
    App.city = document.getElementById('city');
    App.tempK = document.getElementById('tempK');
    App.tempF = document.getElementById('tempF');
    App.tempC = document.getElementById('tempC');
    App.condition = document.getElementById('condition');
    App.status = document.getElementById('status');
    App.otherInfo = document.getElementById('otherInfo');
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
                if (App.responseTemplateSet === false){
                    App.innerHTML += App.responseTemplate;
                    App.responseTemplateSet = true;
                }
                loop();
                initWeatherUi();
                updateTimeDate();
                updateWeather();
            }).catch(error => {

                console.log(error)
            });
    }
}

function updateWeather(){
    if (App.responseBox.classList.contains('opacity-0')){
        App.responseBox.classList.remove('opacity-0');
    }
    App.city.textContent = App.weather.data.name;
    App.tempK.textContent = `${App.weather.data.main.temp} °K`;
    App.tempF.textContent = tempToF(App.weather.data.main.temp);
    App.tempC.textContent = tempToC(App.weather.data.main.temp);
    App.condition.innerHTML = `<img class="img-thumb" src="http://openweathermap.org/img/wn/${App.weather.data.weather[0].icon}@2x.png">${App.weather.data.weather[0].description}`;
    App.nextUpdate = [App.hours,App.minutes];
    if (App.minutes + 5 > 60 ){
        App.nextUpdate[1] = (App.minutes +5) - 60;
        App.nextUpdate[0] += 1; 
    }else{
        App.nextUpdate[1] += 5;
    }
    if (App.nextUpdate[0] == 0){
        App.nextUpdate[0] = 12;
    }
    if (App.nextUpdate[1] < 10){
        App.nextUpdate[1] = `0${App.nextUpdate[1]}`;
    }
    if (App.nextUpdate[0] > 12){
        App.nextUpdate[0] -= 12;
        App.status.textContent = `As of ${App.currentTime} on ${App.currentDate}. Next update @ ${App.nextUpdate[0]}:${App.nextUpdate[1]} PM`;
    }else{
        App.status.textContent = `As of ${App.currentTime} on ${App.currentDate}. Next update @ ${App.nextUpdate[0]}:${App.nextUpdate[1]} AM`;
    }

    
    App.otherInfo.innerHTML = 
        `Wind Speed: ${App.weather.data.wind.speed} mph<br>
        Pressure: ${App.weather.data.main.pressure} mb<br>
        Humidity: ${App.weather.data.main.humidity}%<br>
        Feels Like: ${App.weather.data.main.feels_like} °K, ${tempToF(App.weather.data.main.feels_like)}, ${tempToC(App.weather.data.main.feels_like)}`;
    //classSwap(App.response,"d-none","d-block");
    App.updateTimer = setTimeout(apiGet,300000);
}

function formatTime(number){
    if (number < 10){
        number = `0${number}`;
        return number;
    } else {
        return number;
    }
}

function getTime(){
    App.date = new Date();
    App.hours = App.date.getHours();
    App.minutes = App.date.getMinutes();
    App.seconds = App.date.getSeconds();

    App.month = App.date.getMonth();
    App.day = App.date.getDate();
    App.year = App.date.getFullYear();
    App.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
}

function setTime(){
    if (App.hours > 12){
        App.currentTime = `${App.hours - 12}:${formatTime(App.minutes)} PM`;
    }else if(App.hours == 0){
        App.currentTime = `${App.hours + 12}:${formatTime(App.minutes)} AM`;
    }else{
        App.currentTime = `${App.hours}:${formatTime(App.minutes)} AM`;
    }
    App.currentDate = `${App.months[App.month]} ${App.day}, ${App.year}`;
}

function updateTimeDate(){
    getTime();
    setTime();
    App.timeDisplay.textContent = App.currentTime;
    App.dateDisplay.textContent = App.currentDate;
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

function loop(){
    App.timer = setInterval(updateTimeDate, 500);
}

init()