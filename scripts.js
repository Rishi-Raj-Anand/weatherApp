const API_KEY="1cb01fb4f87b46738fb235637252206";
const userTab=document.querySelector(".user-weather");
const searchTab=document.querySelector(".search-weather");


let currentTab=userTab;
changeToUserTab();



userTab.addEventListener('click',()=>{

    if(currentTab!=userTab){
        console.log("Changing to user tab...");
        changeToUserTab();
    }
});

searchTab.addEventListener('click',()=>{

    if(currentTab!=searchTab){
        changeToSearchTab();
        
    }
});

function changeToUserTab(){
    currentTab=userTab;
    searchTab.classList.remove("tab-background");
    userTab.classList.add("tab-background");

    document.querySelector(".search-tab").classList.add("hide-page");
    document.querySelector(".info-page").classList.add("hide-page");
    let userCoordinates=sessionStorage.getItem('userCoordinates');
    
    if(userCoordinates!=null){
        document.querySelector(".location-page").classList.add("hide-page");
        // API call for weather info
        (async()=>{
            let data= await getWeatherData(userCoordinates);
            renderWeatherInfo(data);
        })();   

    }else{
        
        if(navigator.geolocation){
        document.querySelector(".info-page").classList.add("hide-page");
        document.querySelector(".location-page").classList.remove("hide-page");
        console.log("Getting user location...");

        navigator.geolocation.getCurrentPosition(successInAccessingLocation, errorInAccessingLocation);
        
        }else {
            document.querySelector(".location-page").classList.remove("hide-page");
            document.querySelector(".error-page").classList.add("hide-page");
            console.log("Location feature not available");
        }
    }

}


async function getWeatherData(cityQuery){
    document.querySelector(".loading-page").classList.remove("hide-page");
    document.querySelector(".info-page").classList.add("hide-page");
    document.querySelector(".error-page").classList.add("hide-page");
    console.log("Getting weather details...");

    try{
        let response=await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cityQuery}&aqi=yes`);

        if(response.ok){
            const  data = await response.json();
            return data;
        }else{
            throw new Error(`HTTP Error :${response.status}`);
        }
        

    }catch(err){
        console.log(err);
        return null;
    }
}

function successInAccessingLocation(position) {
    console.log("Location acquired...");
    let userLatitude=position.coords.latitude;
    let userLongitude=position.coords.longitude;

    let userCoordinates=`${userLatitude},${userLongitude}`;

    console.log("coordinates:",userLatitude,userLongitude);
    sessionStorage.setItem("userCoordinates", userCoordinates);

    document.querySelector('.get-access-btn').addEventListener('click',async()=>{
    document.querySelector(".location-page").classList.add("hide-page");
    // API call for weather info
    let data= await getWeatherData(userCoordinates);
    renderWeatherInfo(data);
    });

}

function errorInAccessingLocation() {
//   alert("Sorry, no position available.");

    console.log("Unable to fetch user location...");
    document.querySelector(".loading-page").classList.add("hide-page");
    document.querySelector(".info-page").classList.add("hide-page");
    document.querySelector(".error-page").classList.add("hide-page");

}

function renderWeatherInfo(data){

    document.querySelector(".loading-page").classList.add("hide-page");
    if(data!=null){
        document.querySelector(".info-page").classList.remove("hide-page");
        let locationName=data?.location?.name;
        let country=data?.location?.country;
        let state=data?.location?.region;
        let temperature=data?.current?.temp_c;
        let isDay=data?.current?.is_day; // 1 or 0
        let weatherDesc=data?.current?.condition?.text;
        let weatherDescIcon=`http:${data?.current?.condition?.icon}`;
        let windSpeed=data?.current?.wind_kph; // in km per hours
        let windDirection=data?.current?.wind_dir;
        let humidity=data?.current?.humidity;
        let cloud=data?.current?.cloud;
        let feelLike=data?.current?.feelslike_c;
        let visibility=data?.current?.vis_km;
        let uv=data?.current?.uv;

        let wrapper=document.querySelector(".wrapper");
        if(isDay){
            wrapper.classList.remove("night");
            wrapper.classList.add("day");
        }else{
            wrapper.classList.remove("day");
            wrapper.classList.add("night");
        }

        document.querySelector(".location-name").innerText=locationName;
        document.querySelector(".state-name").innerText=`${state},${country}`;
        document.querySelector(".weather-desc").innerText=weatherDesc;
        document.querySelector("[weather-img]").src=weatherDescIcon;
        document.querySelector(".temperature").innerText=`${Math.trunc(temperature)}°C`;

        document.querySelector(".windspeed-info").innerText=`${windSpeed} km/h`;
        document.querySelector(".wind-dir").innerText=`${windDirection}`;

        document.querySelector(".humidity-info").innerText=`${humidity}％`;

        document.querySelector(".clouds-info").innerText=`${cloud}％`;

    }else{
        document.querySelector(".info-page").classList.add("hide-page");
        document.querySelector(".error-page").classList.remove("hide-page");
        console.log("Data not found");
    }
    

}

function changeToSearchTab(){
    console.log("Changing to search tab...");
    currentTab=searchTab;
    userTab.classList.remove("tab-background");
    searchTab.classList.add("tab-background");

    const searchBtn=document.querySelector(".search-city-btn");

    const search=document.querySelector("[city]");

    document.querySelector(".location-page").classList.add("hide-page");
    document.querySelector(".info-page").classList.add("hide-page");
    document.querySelector(".error-page").classList.add("hide-page");

    document.querySelector(".search-tab").classList.remove("hide-page");
    search.value="";

    search.addEventListener("keydown",async(e)=>{
        
        if(e.key=="Enter"){
            let cityName=search.value;
        // API call for weather info
            let data= await getWeatherData(cityName);
            renderWeatherInfo(data);
        }
        
    });

    searchBtn.addEventListener("click",async()=>{
        let cityName=search.value;
        // API call for weather info
        let data= await getWeatherData(cityName);
        renderWeatherInfo(data);
    });
}




