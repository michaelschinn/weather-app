| Project | Author | Date | Description |
|---|---|---|---|
| Weather App | Michael Chinn | 9/29/2021 | Create a webpage that prompts users to enter a zip code, then displays current weather information for that location or a friendly error message if the zip code is not found.|

## Process

#### START

- CALL init
- USER enters their zip code into INPUT
- USER 'clicks' submit BUTTON
- CALL apiGet

### STATE
- STATE EQUALS 0
    - CALL initUi
- STATE EQUALS 1
    - CALL FUNCTION apiGet

### Functions
- DEFINE FUNCTION init
    - STATE is set to 0
- DEFINE FUNCTION changeState ARG newState
    - SET STATE EQUALS newState
- DEFINE FUNCTION update
    - CALL onStateChange
- DEFINE FUNCTION uiUpdate
    - SET App.city's TEXT CONTENT EQUALS App.weather.city
    - SET App.temperature's TEXT CONTENT EQUALS App.weather.temperature
    - SET App.condition's TEXT CONTENT EQUALS App.weather.condition
    - SET App.otherInfo's TEXT CONTENT EQUALS ARRAY | [insert other info here]
- DEFINE FUNCTION initUi
    - Page elements are DEFINED as variables
        - INPUT
        - BUTTON | "submit"
- DEFINE FUNCTION apiget
    - GET data from weather api
        - THEN store the data to a variable
        - THEN SET timer EQUALS setInterval(CALL FUNCTION apiGet, 60000)

### Events
- BUTTON | "submit" | "click"
    - CALL FUNCTION changeState ARGS 1