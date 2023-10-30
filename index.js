const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://127.0.0.1/test', { useNewUrlParser: true, useUnifiedTopology: true });


const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  methodOverride = require("method-override");

const app = express();

app.use(bodyParser.json());

app.use(morgan("common"));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');


app.get("/",passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send("Welcome to my movie API!");
});

app.get('/movies', async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/:Title',passport.authenticate('jwt', { session: false }), async (req,res) =>{
  await Movies.findOne({Title : req.params.Title})
  .then((movie)=> {
    res.json(res.json(movie));
  })
  .catch((err)=> {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.get('/movies/genres/:Genre', passport.authenticate('jwt', { session: false }),async (req,res) =>{
  Movies.findOne({' Genre.Name' : req.params.genreName})
  .then((movie)=> {
    res.status(200).json(movie.Genre);
  })
  .catch((err)=> {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }),(req, res) => {
  Movies.findOne({ 'Director.Name': req.params.directorName })
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/users', passport.authenticate('jwt', { session: false }),async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/users/:Username',  passport.authenticate('jwt', { session: false }),async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

app.put('/users/:Username', passport.authenticate('jwt', { session: false }),async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true })
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  })

});

app.post('/users/:Username/movies/:MovieID',passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { movieList: req.params.MovieID }
   },
   { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.delete('/users/:Username',passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.delete('/users/:Username/movies/:MovieID',passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $pull: { movieList: req.params.MovieID } },
    { new: true }
  )
    .then(updatedUser => {
      res.json(updatedUser);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.use(express.static("public"));

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Something went wrong");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
