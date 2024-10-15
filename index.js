let userTab = document.querySelector("[data-yourWeather]");
let searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-Container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-Info-conatiner");
const apiErrorImg = document.querySelector("[data-notFoundImg]");
const apiErrorMessage = document.querySelector("[data-apiErrorText]");
const apiErrorBtn = document.querySelector("[data-apiErrorBtn]");
const messageText = document.querySelector("[data-messageText]");
const apiErrorContainer = document.querySelector(".api-error-container");
const grantAccessBtn = document.querySelector("[data-grantAccess]");

// intitial variable needed
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
let currentTab = userTab;
currentTab.classList.add("current-tab");
getFromSessionStorage();

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            messageText.innerText = "You denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            messageText.innerText = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            messageText.innerText = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            messageText.innerText = "An unknown error occurred.";
            break;
    }
}

function switchTab(clickedTab) {
    apiErrorContainer.classList.remove("active");
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");


        if (!searchForm.classList.contains("active")) {
            console.log(1)
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");

        } else {
            console.log(2)
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            getFromSessionStorage();

        }

    }


}

// check is co-ordinates is present in session storage
async function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        // agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");


    } else {
        const coordinates = await JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);

    }

}

async function fetchUserWeatherInfo(coordinates) {
    const { lati, longi } = coordinates;
    // make grant access container invisible;
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // API call
    try {
       const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${longi}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        console.log(data)
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);



    } catch (error) {
        loadingScreen.classList.remove("active");
        apiErrorContainer.classList.add("active");
        apiErrorImg.style.display = "none";
        apiErrorMessage.innerText = `Error: ${error?.message}`;
        apiErrorBtn.addEventListener("click", fetchUserWeatherInfo);
    }

}


function renderWeatherInfo(weatherInfo) {


    const cityName = document.querySelector("[data-cityName]");

    const countryIcon = document.querySelector("[ data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");



    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`
    desc.innerHTML = weatherInfo?.weather?.[0]?.main;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

    temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;




}


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);

    } else {
        // show an alert for no geolocation support available
        grantAccessBtn.style.display = "none";
        messageText.innerText = "Geolocation is not supported by this browser.";
    }
}
function showPosition(position) {
    const useCoordinates = {
        lati: position.coords.latitude,
        longi: position.coords.longitude

    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(useCoordinates));
    fetchUserWeatherInfo(useCoordinates);

}



grantAccessBtn.addEventListener("click", getLocation);


const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if (cityName === "") {
        return;
    } else {

        fetchSearchWeatherInfo(cityName);
        searchInput.value ="";

    }
});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    apiErrorContainer.classList.remove("active");

    try {
        console.log(11)
        let data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        let response = await data.json();
        if (!response.sys) {
            throw response;
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(response);

    } catch (error) {

        loadingScreen.classList.remove("active");
        apiErrorContainer.classList.add("active");
        apiErrorMessage.innerText = `${error?.message}`;
        apiErrorBtn.style.display = "none";
    }
}



userTab.addEventListener("click", (e) => {
    switchTab(e.currentTarget);
});
searchTab.addEventListener("click", (e) => {
    switchTab(e.currentTarget);
});











