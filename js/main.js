//const { default: axios } = require("axios");
const App = document.getElementById('App');
function init(){
    setState(0);
    App.apiKey = "dcda06bf12abf7a7d0e5a9ff6149fcaf"
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

function initUi(){
    App.zipcode = document.getElementById('zipCode');
    App.submitBtn = document.getElementById('submit');
    App.city = document.getElementById('city');
    App.temperature = document.getElementById('temperature');
    App.condition = document.getElementById('condition');
    App.otherInfo = document.getElementById('otherInfo');
    bindEvents();
}

function bindEvents(){
    App.submitBtn.addEventListener('click', () => {
        apiGet();
    });
}

function apiGet(){
    axios.get(`http://api.openweathermap.org/data/2.5/weather?zip=${App.zipcode.value},us&appid=${App.apiKey}`).
        then((response) => {
            App.weather = response.data.main
            console.log(App.weather.temp)
        }).catch(error => {
            console.log(error)
        });
}

function update(){
    
}

init()