var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Customer = require('./models/customers');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var FacebookTokenStrategy = require('passport-facebook-token');

var config = require('./config.js');

exports.local = passport.use(new LocalStrategy(Customer.authenticate()));

passport.serializeUser(Customer.serializeUser());
passport.deserializeUser(Customer.deserializeUser());

exports.getToken = function(customer) {
    return jwt.sign(customer, config.secretKey,
        {expiresIn: 3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        Customer.findOne({_id: jwt_payload._id}, (err, customer) => {
            if (err) {
                return done(err, false);
            }
            else if (customer) {
                return done(null, customer);
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.getUsernameFromEmail = function(req, res, next) {
    if (!req.body.username)
        req.body.username = req.body.email;
    next();
};

exports.verifyCustomer = function(req, res, next) {
    passport.authenticate('jwt', function(err, customer, info) {
        if (err) { 
            err.status = 403; 
            return next(err); 
        }
        if (!customer) {  
            err = new Error('You are not logged in!');
            err.status = 403;
            return next(err);
        }
        req.customer = customer;
        next();
  })(req, res, next);
};

exports.processFacebookToken = (req, res, next) => {
    req.headers['access_token'] = req.body.access_token;
    next();
}

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    Customer.findOne({facebookId: profile.id}, async (err, customer) => {
        if (err) {
            return done(err, false);
        }
        if (!err && customer !== null) {
            return done(null, customer);
        }
        else {
            const customer_id = await Customer.countDocuments();
            customer = new Customer({ username: profile.displayName, 
                name:(profile.name.givenName + ' ' + profile.name.familyName),
                email:profile.emails[0].value, customer_id:(customer_id + 1)});
            customer.facebookId = profile.id;
            
            customer.save((err, customer) => {
                if (err)
                    return done(err, false);
                else
                    return done(null, customer);
            })
        }
    });
}
));