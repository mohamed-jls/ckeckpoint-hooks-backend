const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));


const moviesFilePath = path.join(__dirname, 'public', 'movies.json');


app.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(moviesFilePath, { encoding: 'utf8' });
    res.status(200).json(JSON.parse(data));
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch movies', details: error.message });
  }
});

app.post('/', async (req, res) => {
  try {
    const data = await fs.readFile(moviesFilePath, { encoding: 'utf8' });
    const movies = JSON.parse(data);

    const newMovie = { ...req.body, id: movies.length ? movies[movies.length - 1].id + 1 : 1 };
    movies.push(newMovie);

    await fs.writeFile(moviesFilePath, JSON.stringify(movies, null, 2), { encoding: 'utf8' });
    res.status(201).send({ message: 'Movie added successfully', movie: newMovie });
  } catch (error) {
    res.status(500).send({ error: 'Failed to add movie', details: error.message });
  }
});

app.delete('/:id', async (req, res) => {
  try {
    const data = await fs.readFile(moviesFilePath, { encoding: 'utf8' });
    const movies = JSON.parse(data);

    const movieIndex = movies.findIndex((movie) => movie.id === parseInt(req.params.id, 10));
    if (movieIndex === -1) {
      return res.status(404).send({ error: 'Movie not found' });
    }

    movies.splice(movieIndex, 1);
    await fs.writeFile(moviesFilePath, JSON.stringify(movies, null, 2), { encoding: 'utf8' });
    res.status(200).send({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete movie', details: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
