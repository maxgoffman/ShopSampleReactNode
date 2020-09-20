var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var passport = require('passport');
const multer  = require('multer')
const upload = multer();
var Customer = require('../models/customers');
var authenticate = require('../authenticate');
const cors = require('./cors');


router.use(bodyParser.json());


const formatResponse = (customer, token) => {
  let clone = JSON.parse(JSON.stringify(customer));
  delete clone._id;
  delete clone.hash;
  delete clone.salt;
  delete clone.__v;
  console.log("customer " + customer);
  console.log("clone " + clone);
  return {
    customer: {
      schema: clone
    },
    accessToken: "bearer " + token,
    expires_in: "1h"
  };
};

router.post('/', cors.cors, upload.none(), async (req, res, next) => {
  const customer_id = await Customer.countDocuments();
  Customer.register(new Customer({name: req.body.name, email:req.body.email, username:req.body.email, customer_id:(customer_id + 1)}), 
    req.body.password, (err, customer) => {
      if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      customer.save((err, customer) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        req.body.username = req.body.email;
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          var token = authenticate.getToken({_id: customer._id});
          res.setHeader('Content-Type', 'application/json');
          res.json(formatResponse(customer, token));
        });
      });
    }
  });
});

router.post('/login', cors.cors, upload.none(), authenticate.getUsernameFromEmail, passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(formatResponse(req.user, token));
});


router.post('/facebook', upload.none(), authenticate.processFacebookToken, passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(formatResponse(req.user, token));
  }
});

module.exports = router;
