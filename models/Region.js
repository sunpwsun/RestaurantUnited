const mongoose = require('mongoose');
const { Schema } = mongoose;    // == const Schema = mongoose.Schema;

const regionSchema = new Schema({
    regionID : { type: Number, required: true, unique: true },
    city : { type: String, required: true },
    latitude : { type: Number, required: true },
    longitude : { type: Number, required: true }
});


// Find One by regionID
regionSchema.statics.findOneByRegionID = function( regionID ) {
    
    return this.findOne({ regionID })
}

// Find All
regionSchema.statics.findAll = function() {

    // return promise
    return this.find({})
}


module.exports = mongoose.model('regions', regionSchema);