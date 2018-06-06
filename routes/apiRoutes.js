


const Restaurant    = require('../models/Restaurant')
const Region        = require('../models/Region')




module.exports = (app) => {


    app.set('views', __dirname + '.\\..\\views');
    app.set('view engine', 'ejs');


    app.get(
        '/welcome',
        (req, res) => {
            res.header('result', 'success') // only for android app
            res.send(`
                <div>Welcome</div>
                <div><a href='/logout'>Log out</a></div>


            `)
        }
    )

    app.get(
        '/logout',
        (req, res) => {
            req.logout()
            res.redirect('/')
        }
    )


    app.get(
        '/signup',
        (req, res) => {
            res.render('signup',{error:req.flash('error')})
        }
    )



    /// splite the temple
    app.get(
        '/', 
        (req, res) => {
            res.header('result', 'fail')        // only for android app
            res.send(`
                <form method="post" action="/auth/login">
                    <div>
                        <label>Username</label>
                        <input type="text" name="username" autofocus autocomplete="off" required />
                    </div>
                    <div> 
                        <label>Password</label>
                        <input type="password" name="password"  required />
                    </div>
                    <div>
                        <input type="submit" value="Log in" />
                    </div>    
                </form>
                <br>
                <div><a href='/signup'>Sign up</a></div>
                <br>
                <div><a href='/auth/google'>Google Auth</a></div>
                <br>
                <div><a href='/auth/facebook'>Facebook Auth</a></div>
            `)
        }) 
    

    app.get('/loggedUser', (req, res) => {
            if( req.user )
                res.send('Logged user : ' + req.user.name )
            else
                res.send('Not logged' )
        }) 

    // OK
    // GET all restaurants    
    // Do not call this api if the number of restaurants is larger than large number 
    // because of the performance
    // this returns everything of the restaurant
    app.get('/api/restaurants', (req, res) => {

        /*
            Restaurant.find( (err, restaurants) => {
            
                if( err )
                    return res.status(500).send( {error: 'database failure'} );
                res.json(restaurants);
            })
        */
        Restaurant.findAll()
            .then( ( restaurants ) => {
                if( !restaurants.length )
                    return res.status(404).send({ err: 'Restaurant not found' })
                res.json(restaurants)
            })
            .catch(err => res.status(500).send(err))
    });

    // OK
    // GET all restaurants in the specified region    
    app.get('/api/restaurants/:regionID', (req, res) => {

      
        console.log( 'findMultiByRegionID : ' + req.params.regionID )

        Restaurant.findMultiByRegionID( req.params.regionID )
            .then( ( restaurants ) => {
                if( !restaurants.length )
                    return res.status(404).send({ err: 'Restaurant not found' })
                res.json(restaurants)
            })
            .catch(err => res.status(500).send(err))
    });



    // OK
    // GET specified restaurant information
    app.get('/api/restaurant/:id', (req, res) => {


        Restaurant.findOneByRestaurantID( req.params.id )
            .then( ( restaurant ) => {

                if( !restaurant ) 
                    return res.status(404).send({ err: 'Restaurant not found' })
                res.json(restaurant)
            })
            .catch( err => res.status(500).send(err))

    });


    // OK
    // GET specified menu information
    app.get('/api/restaurant/:restid/menu/review/:menuid', (req, res) => {
 
        Restaurant.findOneByRestaurantID( req.params.restid )
            .then( ( restaurant ) => {

                if( !restaurant ) 
                    return res.status(404).send({ err: 'Restaurant not found' })
                
                const menu = restaurant.menu.find( item => item.menuID === req.params.menuid )
                res.json( menu )
            })
            .catch( err => res.status(500).send(err))

    })


    app.get('/api/regions', (req, res) => {

        Region.findAll()
            .then( ( regions ) => {
                if( !regions.length )
                    return res.status(404).send({ err: 'Region not found' })
                res.json(regions)
            })
            .catch(err => res.status(500).send(err))
    })




    // OK
    // Add specified restaurant's review
    app.put('/api/restaurant/review/:id', (req, res) => {

        Restaurant.findOne( {restaurantID:req.params.id}, (err, restaurant) => {

            if( err )
                return res.status(500).send( {error: 'Database failure'} );
            if( !restaurant )
                return res.status(404).json({error: 'Restaurant not found'});

            // new review
            let newReview = {}

            if(req.body.rating) newReview.rating = req.body.rating
            if(req.body.review) newReview.review = req.body.review
            if(req.body.name) newReview.name = req.body.name
            if(req.body.id) newReview.userID = req.body.id
            newReview.date = new Date().toISOString().substring(0,10)

            //restaurant.menu.push(newReview)

            // calculate avg rating
            let total = 0
            restaurant.reviews.forEach(review => {
                total += review.rating
            });

            restaurant.rating = ( total / restaurant.reviews.length )

            // update
            restaurant.save( (err) => {

                if( err ) 
                    res.status(500).json( {error: 'failed to update'} );

                res.json({message: 'Reviewed'});
            });
        });
    });

    // OK
    // Add specified menu's review
    app.put('/api/restaurant/:restid/menu/review/:menuid', (req, res) => {

        Restaurant.findOne( {restaurantID:req.params.restid}, (err, restaurant) => {

            if( err )
                return res.status(500).send( {error: 'Database failure'} );
            if( !restaurant )
                return res.status(404).json({error: 'Restaurant not found'});

            // new review
            let newReview = {}

            if(req.body.rating) newReview.rating = req.body.rating
            if(req.body.review) newReview.review = req.body.review
            if(req.body.name) newReview.name = req.body.name
            if(req.body.id) newReview.userID = req.body.id
            newReview.date = new Date().toISOString().substring(0,10)

            const menu = restaurant.menu.find( item => item.menuID === req.params.menuid )

            menu.reviews.push(newReview)

            // calculate avg rating
            let total = 0
            menu.reviews.forEach(review => {
                total += review.rating
            });

            menu.rating = ( total / menu.reviews.length )

            // update
            restaurant.save( (err) => {

                if( err ) 
                    res.status(500).json( {error: 'failed to update'} );

                res.json({message: 'Reviewed'});
            });
        });
    });

/*
    // UPDATE specified restaurant infomation
    app.put('/api/restaurant/:id', (req, res) => {

        Restaurant.findById(req.params.id, (err, restaurants) => {

            if( err )
                return res.status(500).send( {error: 'Database failure'} );
            if( !restaurants )
                return res.status(404).json({error: 'Restaurant not found'});

            if(req.body.title) book.title = req.body.title;
            if(req.body.author) book.author = req.body.author;
            if(req.body.published_date) book.published_date = req.body.published_date;

            book.save(function(err){
                if(err) res.status(500).json({error: 'failed to update'});
                res.json({message: 'book updated'});
            });

        });

    });
    // DELETE BOOK
    app.delete('/api/books/:book_id', function(req, res){
        res.end();
    });
*/
}