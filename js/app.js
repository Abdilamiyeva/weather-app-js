const wrapper = document.querySelector(".wrapper");  //container div
inputPart = wrapper.querySelector(".input-part"); // input section
infoTxt = inputPart.querySelector(".info-txt"); // please enter... 
inputField = inputPart.querySelector("input"); // input 
locationBtn = inputPart.querySelector("button");
wIcon = document.querySelector("img");
arrowBack = wrapper.querySelector("header i");
searchIcon = document.querySelector(".searchIcon");

let api;

inputField.onkeydown = function(e){
    if(e.keyCode == 13 &&  inputField.value != ""){
        requestApi(inputField.value);  
    }
};

searchIcon.addEventListener("click", e => {
    if (inputField.value === "" || inputField.value === " "){
        alert("Iltimos ma'lumot kiriting !")
    } else {
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () => {
    //agar brauzer joylashuvni qo'llab-quvvatlasa
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Sizning brauzeringiz geolocation API-ni qo'llab-quvvatlamaydi");
    }
});

function requestApi(city){
    //api olindi va json ob'ektiga aylantiririldi
api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=8641075dda9ea5d5c961c48c00929bec`;
fetchData();
};

function onSuccess(position){
    //width uzunligi. Bu yerda biz uni Coords obyektidan olamiz.
const {latitude, longitude} = position.coords; 
api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=8641075dda9ea5d5c961c48c00929bec`;
fetchData();
};

function onError(error){
    infoTxt.innerText = error.message; //Brauzerda  ko'rinadigan  xato.
    infoTxt.classList.add("error");
};

function fetchData(){
    infoTxt.innerText = "Ob-havo ma'lumotlarini olish...";
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
    // keyin funksiya. U api natijasi bilan weatherDetails ni chaqiradi.
};

function weatherDetails(info){
    if(info.cod == "404"){
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} shahar nomi emas `;
    }else {
        //consoldan ma'lumot
    const city = info.name;
    const country = info.sys.country;
    const {description, id} = info.weather[0];
    const {feels_like, humidity, temp} = info.main;

        if(id == 800){
            wIcon.src="images/clear.svg"
        } else if (id >= 200 && id <=232){
            wIcon.src="images/strom.svg"
        } else if (id >= 600 && id <= 622){
            wIcon.src="images/snowy.svg"
        } else if (id >= 701 && id <=781){
            wIcon.src="images/haze.svg"
        } else if (id >= 801 && id <=804){
            wIcon.src="images/cloudy.svg"
        }  else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)){
            wIcon.src="images/rainy.svg"
        } 

   //DOMga chizish uchun 
    wrapper.querySelector(".temp .numb").innerText =  Math.floor(temp);
    wrapper.querySelector(".weather").innerText = description.toUpperCase();
    wrapper.querySelector(".location span").innerText =` ${city},${country}`;
    wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    wrapper.querySelector(".humidity span").innerText=`${humidity}%`;
        
        infoTxt.classList.remove("pending", "error"); 
        infoTxt.innerText = "";
        inputField.value ="";
        wrapper.classList.add("active"); // ob-havoni ko'rsatadi
    }
};

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});