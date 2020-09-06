const CLEFAPI = '9538bdeb0237d0fac380697b08039cc4';
let resultatAPI;

if(navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    // console.log(position);
    let long = position.coords.longitude;
    let lat = position.coords.latitude;
    AppelAPI(long, lat);
  }, () => {
    alert(`Vous avez refus;e la géolocatisation, l'application ne peut pas fonctionner, veuillez l'activer !`)
  })
}

function AppelAPI(long, lat) {
  // console.log(long, lat);

  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${CLEFAPI}`)
  .then((reponse) => {
    return reponse.json();
  })
  .then((data) => {
    console.log(data);
  })
}