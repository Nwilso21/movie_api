const express = require("express"),
    morgan = require('morgan');

const app = express();

const bodyParser = require('body-parser'),
    methodOverride = require('method-override');

app.use(morgan('common'));

let favMovies = [
    {
     "Title": "Django",
    "Genre": {
      "Name": "Western",
      "Description": "Set in cowboy times"
    },
    "Director": {
      "Name": "Quentin Tarantino",
      "Bio": "A very famous director know for his gruesome violence and almost cult like following across his films",
      "Birth": "3/27/1963"
    },
  },
  {
    "Title": "Mulan",
    "Genre": {
        "Name": "Musical",
        "Description" : "Majors scenes and dialogues are portrayed through song"
    },
    "Director": {
        "Name": "Tony Bancroft",
        "Bio": "A lifelong animator who partners often with disney. Known best for directign Mulan",
        "Birth": "7/31/1967"
    }
  }
];

let userList = [
    {
        id:1,
        Name: 'Noah',
        UserMovies: [],
        email : 'burner@gmail.com'
    }
];

app.get('/', (req, res) =>{
    res.send('Welcome to my movie API!');
});

app.get('/movies', (req,res) =>{
    res.json(favMovies);
});

app.get('/movies/:title', (req, res)=>{
    const { title } = req.params;
    const movie = favMovies.find(movie => movie.Title === title );
  
    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(400).send('movie not in list')
    }
  });

  app.get('/movies/genre/:genreName', (req, res)=>{
    const { genreName } = req.params;
    const genre = favMovies.find(movie => movie.Genre.Name === genreName).Genre;
  
    if (genre) {
      res.status(200).json(genre);
    } else {
      res.status(400).send('genre not in list')
    }
  });

  app.get('/movies/director/:directorName', (req, res)=>{
    const { directorName } = req.params;
    const director = favMovies.find(movie => movie.Director.Name === directorName).Director;
  
    if (director) {
      res.status(200).json(director);
    } else {
      res.status(400).send('director not in list')
    }
  });

  app.post('/userList/', (req, res)=> {
    const newUser = req.body;
  
    if (newUser.Name) {
      newUser.id = uuid.v4();
      userList.push(newUser);
      res.status(201).json(newUser)
    }else {
      res.status(400).send('user needs a name')
    }
  });

  app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user');
    }
});

app.post('/user/:id/:movieTitle', (req,res) => {
    const {id,movieTitle} = req.params;
    let user = user.find(user => user.id ===id);

    if(user){
        user.UserMovies = user.UserMovies.filter(title => title !== movieTitle);
        res.status(200).json(`${movieTitle} has been added to user ${id}' array`);
    }else{
        res.status(400).send('user not in list');
    }
});

app.delete('/users/:id/:movietitle', (req, res)=> {
    const { id, movieTitle} = req.params;
  
    let user = user.find(user => user.id == id);
  
    if (user) {
      user.UserMovies = user.UserMovies.filter( title => title !== movieTitle);
      res.status(200).json(`${movieTitle} has been removed from user ${id}'s array`);
    } else {
      res.status(400).send('user not in list')
    }
  });

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something went wrong');
})

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});