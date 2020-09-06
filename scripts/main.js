import tabJoursEnOrdre from './Utilitaire/gestionTemps.js';

// console.log('DEPUIS MAIN JS ' + tabJoursEnOrdre);

const CLEFAPI = '9538bdeb0237d0fac380697b08039cc4';
let resultatAPI;

const temps = document.querySelector('.temps');
const temperature = document.querySelector('.temperature');
const localisation = document.querySelector('.localisation');
const heure = document.querySelectorAll('.heure-nom-prevision');
const tempPourH = document.querySelectorAll('.heure-prevision-valeur');
const joursDiv = document.querySelectorAll('.jour-prevision-nom');
const tempsJourDiv = document.querySelectorAll('.jour-prevision-temp');
const imgIcon = document.querySelectorAll('.logo-meteo');

if(navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    // console.log(position);
    let long = position.coords.longitude;
    let lat = position.coords.latitude;
    AppelAPI(long, lat);
  }, () => {
    alert(`Vous avez refusé la géolocatisation, l'application ne peut pas fonctionner, veuillez l'activer !`)
  })
}

function AppelAPI(long, lat) {
  // console.log(long, lat);

  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${CLEFAPI}`)
  .then((reponse) => {
    return reponse.json();
  })
  .then((data) => {
    // console.log(data);

    resultatAPI = data;

    temps.innerText = resultatAPI.current.weather[0].description;
    temperature.innerText = `${Math.trunc(resultatAPI.current.temp)}º`;
    localisation.innerText = resultatAPI.timezone;

    // les heures par tranches de 3, avec leur temperature

    let heuresActuelle = new Date().getHours()+3;

    for(let i = 0; i < heure.length; i++) {
      let heureIncr = heuresActuelle + i * 3;

      if(heureIncr > 24) {
        heure[i].innerText = `${heureIncr - 24}h`;
      } else if(heureIncr === 24) {
        heure[i].innerText = `00h`;
      } else {
        heure[i].innerText = `${heureIncr}h`;
      }

    }

    //temperature par tranche de 3 heures
    for(let j = 0; j < tempPourH.length; j++) {
      tempPourH[j].innerText = `${Math.trunc(resultatAPI.hourly[j * 3 + 3].temp)}º`
    }

    //afficher les jours sur la derniere ligne 
    for(let k = 0; k < tabJoursEnOrdre.length; k++) {
      joursDiv[k].innerText = tabJoursEnOrdre[k];
    }

    //afficher la temperature de chaque jour
    for(let m = 0; m < 7; m++) {
      tempsJourDiv[m].innerText = `${Math.trunc(resultatAPI.daily[m + 1].temp.day)}º`
    }

    //icone dynamique
    if(heuresActuelle >= 6 && heuresActuelle <= 21) {
      imgIcon.src = `ressources/jour/${resultatAPI.current.weather[0].icon}.svg`
    } else {
      imgIcon.src = `ressources/nuit/${resultatAPI.current.weather[0].icon}.svg`
    }

  })
}