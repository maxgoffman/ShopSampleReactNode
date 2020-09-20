const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');
const multer  = require('multer')
const upload = multer();


const Products = require('../models/products');
const Reviews = require('../models/reviews');

const productRouter = express.Router();
var authenticate = require('../authenticate');

productRouter.use(bodyParser.json());


function truncate_description(input, description_length) {
    for (let value of input) {
        if (description_length && value.description.length > description_length)
            value.description = value.description.substring(0, description_length) + "...";
    }
}
    
productRouter.route('/')
.get(cors.cors, async (req,res,next) => {
    try{    
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const description_length = parseInt(req.query.description_length);
        const countedDocuments = await Products.countDocuments();
        const products = await Products.find({}, {_id:0, category_id:0, department_id:0, image:0, image2:0}).skip((page ? page - 1 : page) * limit).limit(limit);
        truncate_description(products, description_length);
        const returnValue = {count:countedDocuments, rows:products};
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(returnValue);
    } catch(err) {
        next(err);
    }
});

const escapeRegex = (string) => {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
productRouter.route('/search')
.get(cors.cors, async (req,res,next) => {
    try{    
        const regex = new RegExp(escapeRegex(req.query.query_string), 'gi');
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const description_length = parseInt(req.query.description_length);
        const countedDocuments = await Products.countDocuments();
        const products = await Products.find({name: regex}, {_id:0, category_id:0, department_id:0, image:0, image2:0}).skip((page ? page - 1 : page) * limit).limit(limit);
        truncate_description(products, description_length);
        const returnValue = {count:countedDocuments, rows:products};
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(returnValue);
    } catch(err) {
        next(err);
    }
});

const getProductById = async (req, res, next) => {
    try{    
        const id = parseInt(req.params.id);
        const description_length = parseInt(req.query.description_length);
        const products = await Products.find({product_id:id}, {_id:0, category_id:0, department_id:0});
        truncate_description(products, description_length);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(products[0]);
    } catch(err) {
        next(err);
    }
};

productRouter.route('/:id').get(cors.cors, getProductById);

productRouter.route('/:id/details').get(cors.cors, getProductById);

productRouter.route('/inCategory/:id')
.get(cors.cors, async (req,res,next) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const description_length = parseInt(req.query.description_length);
        const countedDocuments = await Products.find({category_id: req.params.id}).countDocuments();
        const products = await Products.find({category_id: req.params.id},{_id:0, category_id:0, department_id:0, image:0, image2:0}).skip((page ? page - 1 : page) * limit).limit(limit);
        truncate_description(products, description_length);
        
        const returnValue = {count:countedDocuments, rows:products};
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(returnValue);
    } 
    catch(err) {
        next(err);
    }
});

productRouter.route('/inDepartment/:id')
.get(cors.cors, async (req,res,next) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const description_length = parseInt(req.query.description_length);
        const countedDocuments = await Products.find({category_id: req.params.id}).countDocuments();
        const products = await Products.find({department_id: req.params.id},{_id:0, category_id:0, department_id:0, image:0, image2:0}).skip((page ? page - 1 : page) * limit).limit(limit);
        truncate_description(products, description_length);
        
        const returnValue = {count:countedDocuments, rows:products};
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(returnValue);
    } 
    catch(err) {
        next(err);
    }
});


productRouter.route('/:id/reviews')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, async (req,res,next) => {
    try{    
        const reviews = await Reviews.find({product_id:req.params.id}).populate('author',{_id:0});
        const returnValue = reviews.map((item) => {
            return {rating:item.rating, review:item.review, name:(item.author ? item.author.name : "Anonymous"), created_on: item._id.getTimestamp()};
        });
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(returnValue);
    } catch(err) {
        next(err);
    }
})
.post(cors.cors, upload.none(), authenticate.verifyCustomer, async (req, res, next) => {
    try{    
        const products = await Products.find({product_id:req.params.id});
        if (products.length > 0) {
            const {review, rating} = req.body;
            const insertDocument = {product_id:req.params.id, review:review, rating:rating, author:req.customer._id};
            
            const createdReview = await Reviews.create(insertDocument);
    
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({state: "success"});
        }        
    } catch(err) {
        next(err);
    }
})


module.exports = productRouter;