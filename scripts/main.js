import tabJoursEnOrdre from './Utilitaire/gestionTemps.js';

// console.log('DEPUIS MAIN JS ' + tabJoursEnOrdre);

const CLEFAPI = '9538bdeb0237d0fac380697b08039cc4';
let resultatsAPI;

const temps = document.querySelector('.temps');
const temperature = document.querySelector('.temperature');
const localisation = document.querySelector('.localisation');
const heure = document.querySelectorAll('.heure-nom-prevision');
const tempPourH = document.querySelectorAll('.heure-prevision-valeur');
const joursDiv = document.querySelectorAll('.jour-prevision-nom');
const tempsJourDiv = document.querySelectorAll('.jour-prevision-temp');
const imgIcone = document.querySelector('.logo-meteo');
// const chargementContainer = document.querySelector('.overlay-icone-chargement');
const dateJour = document.querySelector('.date'); 


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

let date = new Date();
let dateLocale = date.toLocaleString('fr-FR', {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric'
})
dateLocale = dateLocale.charAt(0).toUpperCase() + dateLocale.slice(1,6) + ' ' + dateLocale.charAt(7).toUpperCase() + dateLocale.slice(8,17);
dateJour.innerText = dateLocale;
console.log(dateLocale);

// dateJour.innerText = `${dateJour.getDate() + dateJour.getMonth() + dateJour.getFullYear()}`


function AppelAPI(long, lat) {
  // console.log(long, lat);

  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${CLEFAPI}`)
  .then((reponse) => {
    return reponse.json();
  })
  .then((data) => {
    // console.log(data);

    resultatsAPI = data;

    temps.innerText = resultatsAPI.current.weather[0].description;
    temperature.innerText = `${Math.trunc(resultatsAPI.current.temp)}º`;
    localisation.innerText = resultatsAPI.timezone;


    // les heures par tranches de 3, avec leur temperature

    let heureActuelle = new Date().getHours()+3;

    for(let i = 0; i < heure.length; i++) {

      let heureIncr = heureActuelle + i * 3;

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
      tempPourH[j].innerText = `${Math.trunc(resultatsAPI.hourly[j * 3 + 3].temp)}º`
    }

    
    //afficher les jours sur la derniere ligne 
    for(let k = 0; k < tabJoursEnOrdre.length; k++) {
      joursDiv[k].innerText = tabJoursEnOrdre[k];
    }
    

    //afficher la temperature de chaque jour
    for(let m = 0; m < 7; m++) {
      tempsJourDiv[m].innerText = `${Math.trunc(resultatsAPI.daily[m + 1].temp.day)}º`
    }

    //icone dynamique
    if(heureActuelle >= 6 && heureActuelle <= 21) {
      imgIcone.src = `ressources/jour/${resultatsAPI.current.weather[0].icon}.svg`
    } else {
      imgIcone.src = `ressources/nuit/${resultatsAPI.current.weather[0].icon}.svg`
    }
    // console.log(imgIcone);

    // chargementContainer.classList.add('disparition');

  })
}