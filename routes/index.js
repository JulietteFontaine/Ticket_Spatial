var express = require('express');
var router = express.Router();
var request = require("sync-request");
const mongoose = require('mongoose');


var majuscule = function (mot) {
  return mot.charAt(0).toUpperCase() + mot.slice(1).toLowerCase();
};

var userModel = require('../models/users')
var journeyModel = require('../models/journey')

var city = ["Terre","Mars","Neptune","Saturne","Uranus","Pluton","Mercure","Namek"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]

/* GET Index */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET homepage. */
router.get('/homepage', function(req, res, next) {
  if(req.session.panier == undefined){
    req.session.panier = [];
  }


  res.render('homepage', {panier:req.session.panier});
});

/* GET Results. */
router.get('/panier', async function(req, res, next) {

  if(!req.session.user){
    res.render('index');
  }

  var alreadyExist = false;
  var panier = req.session.panier;
  
  var searchTrip = await journeyModel.find({
    departure: req.query.departureFF,
    arrival: req.query.arrivalFF,
    date: req.query.dateDepartFF,
    price : req.query.priceFF
  });
  

  for (var i=0; i<panier.length; i++){
    console.log("st :", searchTrip);
    console.log("panier:", panier[i]);
    if(searchTrip[0].departure == panier[i].departure && searchTrip[0].arrival == panier[i].arrival && searchTrip[0].price == panier[i].price){
    alreadyExist = true;
    }

    }

if(alreadyExist ==false){
  for (i=0; i<searchTrip.length; i++){
  
    req.session.panier.push({
      departure: searchTrip[i].departure,
      arrival: searchTrip[i].arrival,
      date: searchTrip[i].date,
      price: searchTrip[i].price,
      departureTime: searchTrip[i].departureTime,
    })
    }}
    ;

res.render('panier', {searchTrip, panier:req.session.panier})
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
      mail: newUserSave.mail
    }


  res.redirect('/homepage');  //Martin : Attention, il faut bien remplacer le res.render pour envoyer notre user vers la page "achat" quand elle sera créée
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
      id: searchUser._id,
      mail: searchUser.mail
    }
    res.redirect('/homepage');
  }
});

router.post('/SearchTrip', async function(req, res, next) {

  var date = req.body.dateDepartFF;
  var searchTrip = await journeyModel.find({
    departure: majuscule(req.body.departFF),
    arrival: majuscule(req.body.arriveeFF),
    date: req.body.dateDepartFF,
  });

res.render('result', {searchTrip, date, panier:req.session.panier});
});

/* LastTrips route */

router.get('/lasttrip', async function(req, res, next) {
  if(!req.session.user){
    res.render('index');
  }

  panier = req.session.panier
  user = await userModel.findOne({mail : req.session.user.mail})
  
  
    
    for (i=0; i<panier.length; i++){
    
      user.lasttrip.push({
        departure: panier[i].departure,
        arrival: panier[i].arrival,
        date: panier[i].date,
        price: panier[i].price,
        departureTime: panier[i].departureTime,
      })

       var lasttripSaved = await user.save();
       var ltsFF = lasttripSaved.lasttrip;
  };
  
  res.render('lasttrip', { lasttripSaved, ltsFF:lasttripSaved.lasttrip})
  
  });

  /* LastTrips route */

router.get('/deconnexion', async function(req, res, next) {

  req.session.destroy()
  res.render('index', {})
  
  });

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