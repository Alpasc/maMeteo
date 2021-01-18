import tabJoursEnOrdre from './Utilitaire/gestionTemps.js';

// console.log('DEPUIS MAIN JS ' + tabJoursEnOrdre);

const CLEFAPI = '7cd81442bf22367738fba35844d219c1';
let resultatsAPI;

const temps = document.querySelector('.temps');
const temperature = document.querySelector('.temperature');
const localisation = document.querySelector('.localisation');
const heure = document.querySelectorAll('.heure-nom-prevision');
const tempPourH = document.querySelectorAll('.heure-prevision-valeur');
const joursDiv = document.querySelectorAll('.jour-prevision-nom');
const tempsJourDiv = document.querySelectorAll('.jour-prevision-temp');
const imgIcone = document.querySelector('.logo-meteo');
const chargementContainer = document.querySelector('.overlay-icone-chargement');
const dateJour = document.querySelector('.date');
const imgIconeHeure = document.querySelectorAll('.logo-future-meteo-h');
const imgIconeJour = document.querySelectorAll('.logo-future-meteo-j')


// if(navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(position => {
//     // console.log(position);
//     let long = position.coords.longitude;
//     let lat = position.coords.latitude;
//     AppelAPI(long, lat);

//   }, () => {
//     alert(`Vous avez refusé la géolocatisation, l'application ne peut pas fonctionner, veuillez l'activer !`)
//   })
// }

// special Toulouse

  let long = 1.44367;
  let lat = 43.604259;
  AppelAPI(long, lat);

//Affichage et mise en forme de la date du jour

let date = new Date();

// console.log(date);
let dateLocale = date.toLocaleString('fr-FR', {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric'
})
// console.log(dateLocale);
dateJour.innerText = dateLocale;


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
    temperature.innerText = `${Math.trunc(resultatsAPI.current.temp)}°`;
    // localisation.innerText = resultatsAPI.timezone;
    localisation.innerText = "Toulouse";


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
      tempPourH[j].innerText = `${Math.trunc(resultatsAPI.hourly[j * 3 + 3].temp)}°`
    }


    //Affichage du logo meteo adapté par tranche de 3h
    for(let j2 = 0; j2 < imgIconeHeure.length; j2++) {
      if(heureActuelle >= 6 && heureActuelle <= 21) {
        imgIconeHeure[j2].src = `ressources/jour/${resultatsAPI.current.weather[0].icon}.svg`
      } else {
        imgIconeHeure[j2].src = `ressources/nuit/${resultatsAPI.current.weather[0].icon}.svg`
      }
    }
    

    //afficher les jours sur la derniere ligne 
    for(let k = 0; k < tabJoursEnOrdre.length; k++) {
      joursDiv[k].innerText = tabJoursEnOrdre[k];
    }

    //afficher la temperature de chaque jour
    for(let m = 0; m < 7; m++) {
      tempsJourDiv[m].innerText = `${Math.trunc(resultatsAPI.daily[m + 1].temp.day)}°`
    }

    //Affichage du logo meteo adapté par tranche de 3h
    for(let m2 = 0; m2 < imgIconeJour.length; m2++) {
      if(heureActuelle >= 6 && heureActuelle <= 21) {
        imgIconeJour[m2].src = `ressources/jour/${resultatsAPI.current.weather[0].icon}.svg`
      } else {
        imgIconeJour[m2].src = `ressources/nuit/${resultatsAPI.current.weather[0].icon}.svg`
      }
    }

    //icone dynamique
    if(heureActuelle >= 6 && heureActuelle <= 21) {
      imgIcone.src = `ressources/jour/${resultatsAPI.current.weather[0].icon}.svg`
    } else {
      imgIcone.src = `ressources/nuit/${resultatsAPI.current.weather[0].icon}.svg`
    }
    // console.log(imgIcone);

    chargementContainer.classList.add('disparition');

  })
}