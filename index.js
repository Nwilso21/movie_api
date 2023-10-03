const express = require("express"),
    morgan = require('morgan');

const app = express();

const bodyParser = require('body-parser'),
    methodOverride = require('method-override');

app.use(morgan('common'));

let favMovies = [
    {
        title: 'Django',
        director: 'Quentin Tarentino'
    },
    {
        title: 'Mulan',
        author: 'Tony Bancroft, Barry Cook'
    },
    {
        title: 'In Time',
        author: 'Andrew Niccol'
    }
];

app.get('/', (req, res) =>{
    res.send('Welcome to my movie API!');
});

app.get('/movies', (req,res) =>{
    res.json(favMovies);
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