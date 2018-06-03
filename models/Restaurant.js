const mongoose = require('mongoose');
const { Schema } = mongoose;    // == const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    restaurantID    : Number,
    name            : String,
    address         : [String],
    type            : [String],
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
    menu            : [
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



// Find One by restaurantID
restaurantSchema.statics.findOneByRestaurantID = function( restaurantID ) {
    
    return this.findOne({ restaurantID })
}

// Find All
restaurantSchema.statics.findAll = function() {

    // return promise
    return this.find({})
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