const apiURL = "https://api.openweathermap.org/data/2.5/weather?id=5604473&units=imperial&appid=5d50935bc3ce8aa3de4654aabf285ea8";

fetch(apiURL)
    .then((response) => response.json())
    .then((jsObject) => {
        document.getElementById("current-temp").textContent = jsObject.main.temp;

        const imageSrc = 'https://openweathermap.org/img/w/' + jsObject.weather[0].icon + '.png';
        const desc = jsObject.weather[0].description;  

        document.getElementById('imagesrc').textContent = imageSrc;

        const icon = document.getElementById('icon')
        icon.setAttribute('src', imageSrc);
        icon.setAttribute('alt', desc);
        icon.title = desc;
    })