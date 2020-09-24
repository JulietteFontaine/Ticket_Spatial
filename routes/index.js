var express = require('express');
var router = express.Router();
var request = require("sync-request");
const mongoose = require('mongoose');

var majuscule = function (mot) {
  return mot.charAt(0).toUpperCase() + mot.slice(1).toLowerCase();
};

var userModel = require('../models/users')
var journeyModel = require('../models/journey')

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]

/* GET Index */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET homepage. */
router.get('/homepage', function(req, res, next) {
  res.render('homepage', { title: 'Express' });
});

/* SignUp route */
router.post('/SignUp', async function(req, res, next) {
  var searchUser = await userModel.findOne({
    mail: req.body.emailSignUpFF
  });

  if(!searchUser){
    var newUser = new userModel({
      name: req.body.nameSignUpFF,
      firstname: req.body.firstNameSignUpFF,
      mail: req.body.emailSignUpFF,
      password: req.body.passwordSignUpFF,
    })
  
    var newUserSave = await newUser.save();
  
    req.session.user = {
      firstname: newUserSave.firstname,
      id: newUserSave._id,
    }


  res.render('index', { title: 'Express' });  //Martin : Attention, il faut bien remplacer le res.render pour envoyer notre user vers la page "achat" quand elle sera créée
}else {
  res.redirect('/')
}
});



/* SignIn route */
router.post('/SignIn', async function(req, res, next) {
  var searchUser = await userModel.findOne({
    mail: req.body.emailSignInFF,
    password: req.body.passwordSignInFF
  });

  if(!searchUser){
    
    res.render('index');
  }else {
    req.session.user = {
      firstname: searchUser.firstname,
      id: searchUser._id
    }
    res.render('homepage', {firstname: searchUser.firstname, id: searchUser._id});  //Martin : Attention, il faut bien remplacer le res.render pour envoyer notre user vers la page "achat" quand elle sera créée
  }
});

router.post('/SearchTrip', async function(req, res, next) {
  var searchTrip = await journeyModel.find({
    departure: majuscule(req.body.departFF),
    arrival: majuscule(req.body.arriveeFF),
    date: req.body.dateDepartFF+"T00:00:00.000+00:00",
  });
  console.log(req.body.dateDepartFF);
  console.log(majuscule(req.body.arriveeFF));
  if(searchTrip){
  res.render('index', {searchTrip});  //Martin : Attention, il faut bien remplacer le res.render pour envoyer notre user vers la page "Resultat" quand elle sera créée
  }


    res.render('', {searchTrip});  //Martin : Attention, il faut bien remplacer le res.render pour envoyer notre user vers la page "Resultat" quand elle sera créée
  }
);

module.exports = router;



// // Remplissage de la base de donnée, une fois suffit
// router.get('/save', async function(req, res, next) {

//   // How many journeys we want
//   var count = 300

//   // Save  ---------------------------------------------------
//     for(var i = 0; i< count; i++){

//     departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
//     arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

//     if(departureCity != arrivalCity){

//       var newUser = new journeyModel ({
//         departure: departureCity , 
//         arrival: arrivalCity, 
//         date: date[Math.floor(Math.random() * Math.floor(date.length))],
//         departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
//         price: Math.floor(Math.random() * Math.floor(125)) + 25,
//       });
       
//        await newUser.save();

//     }

//   }
//   res.render('index', { title: 'Express' });
// });


// // Cette route est juste une verification du Save.
// // Vous pouvez choisir de la garder ou la supprimer.
// router.get('/result', function(req, res, next) {

//   // Permet de savoir combien de trajets il y a par ville en base
//   for(i=0; i<city.length; i++){

//     journeyModel.find( 
//       { departure: city[i] } , //filtre
  
//       function (err, journey) {

//           console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
//       }
//     )

//   }


//   res.render('index', { title: 'Express' });
// });

