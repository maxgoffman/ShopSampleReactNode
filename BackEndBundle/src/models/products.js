const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discounted_price: {
        type: Number,
        min: 0
    },
    thumbnail: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    image2: String,
    department_id:  {
        type: Number,
        required: true
    },
    category_id:  {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

productSchema.plugin(AutoIncrement, {inc_field: 'product_id'});
var Products = mongoose.model('Product', productSchema);

module.exports = Products;