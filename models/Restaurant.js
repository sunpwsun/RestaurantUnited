const mongoose = require('mongoose');
const { Schema } = mongoose;    // == const Schema = mongoose.Schema;


// regionID
// 1001 0001 300
// Nation(4) + State(4) + City(3)

// restaurantID
//


const restaurantSchema = new Schema({
    restaurantID    : Number,
    regionID        : Number,
    name            : String,
    tel             : String,
    address         : [String],
    type            : [String],
    atmosphere      : [String],
    hour            : [String],
    currency        : String,
    tax             : Number,
    rating          : Number,
    reviews         : [
                        {
                            userID  : String,
                            name    : String,
                            rating  : Number,
                            review  : String,
                            date    : String
                        }
                      ],
    menus           : [
                        {
                            menuID  : String,
                            name    : String,
                            price   : Number,
                            rating  : Number,
                            reviews : [
                                            {
                                                userID  : String,
                                                name    : String,
                                                rating  : Number,
                                                review  : String,
                                                date    : String
                                            }
                                      ]
                        }
                      ]
});





/// https://poiemaweb.com/mongoose


// Find One by restaurantID
restaurantSchema.statics.findOneByRestaurantID = function( restaurantID ) {
    
    return this.findOne({ restaurantID })
}

// Find All
restaurantSchema.statics.findAll = function() {

    // return promise
    return this.find({})
}


// Find multiple by regionID
restaurantSchema.statics.findMultiByRegionID = function( regionID ) {

    // return promise
    return this.find({regionID})
}


// Update by todoid
restaurantSchema.statics.updateByRestaurantID = function(restaurantID, newRestaurantInfo) {
    // { new: true }: return the modified document rather than the original. defaults to false
    return this.findOneAndUpdate({ restaurantID }, newRestaurantInfo, { new: true })
}


// Delete by todoid
restaurantSchema.statics.deleteByRestaurantID = function (restaurantID) {
    return this.remove({ restaurantID });
};

/*
// Create new restaurant document
restaurantSchema.statics.create = function (payload) {
    // this === Model
    const todo = new this(payload);
    // return Promise
    return todo.save();
  };
  */

  

  

  


module.exports = mongoose.model('restaurants', restaurantSchema);