import React, { useState, useEfect } from 'react';
import './App.css';
import { useEffect } from 'react';

function App() {
  const baseUrl = 'https://api.themoviedb.org/3/';
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movie, setMovie] = useState({});
  const [cast, setCast] = useState([]);
  const [selectedActors, setSelectedActors] = useState([]);

  const clearState = () => {
    setMovie({});
    setCast([]);
    setSelectedActors([]);
  };

  const getMovieId = async event => {
    event.preventDefault();

    if (searchQuery) {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API}&language=en-US&query=${searchQuery}&page=1&include_adult=false`
      );
      const data = await response.json();
      const [firstMovie] = data.results;
      const { title, id } = firstMovie || {};

      if (title && id) {
        setMovie({ title, id });
        setErrorMessage('');
      } else {
        clearState();
        setErrorMessage('No results');
      }
    }
  };

  // call https://api.themoviedb.org/3/movie/550/credits?api_key=565288506d57afd8bd7cc7e6bfcf01f5 to get person_ids, genders, profile pics
  useEffect(() => {
    if (movie.id) {
      fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${process.env.REACT_APP_TMDB_API}`)
        .then(response => response.json())
        .then(data => {
          const [firstActor, secondActor] = data.cast;
          setSelectedActors([firstActor, secondActor]);
          // setSelectedActors([data.cast[0], data.cast[1]]);
          setCast(data.cast);
        });
    }
  }, [movie]);

  // call https://api.themoviedb.org/3/person/819?api_key=565288506d57afd8bd7cc7e6bfcf01f5&language=en-US to get the birthdays
  // use differenceInYears() from date-fns to get the age difference
  // if it's a negative number convert to positive
  // add themovieid creadit
  // rate the gap on IG slider [🦷-----🦷--} how goood is their characters' age dynamic - https://github.com/leofavre/emoji-slider
  // rate the gap: ✰✰✰✩✩

  useEffect(() => {
    console.log('selectedActors', selectedActors.lenght);
  }, [selectedActors]);

  const renderCast = cast.map((actor, i) => (
    <option value={actor.id} data-gender={actor.gender} key={actor.id}>
      {actor.name}
    </option>
  ));

  const handleSelect = event => {
    const selected = cast.find(actor => actor.id === event.target.value);
    setSelectedActors(actors => [selected, actors[1]]);
  };

  return (
    <div className='App'>
      <form onSubmit={getMovieId}>
        <input type='text' value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        <input type='submit' />
      </form>

      {movie && (
        <p>
          {movie.title} {movie.id}&nbsp;
        </p>
      )}

      {cast.length > 0 && (
        <>
          <p>
            {selectedActors[0].name} &nbsp;&nbsp; {selectedActors[1].name}
          </p>
          <p>
            <select defaultValue={selectedActors[0].id} onChange={handleSelect}>
              {renderCast}
            </select>
            &nbsp;&nbsp;
            <select defaultValue={selectedActors[1].id}>{renderCast}</select>
          </p>
        </>
      )}

      <p style={{ color: 'red' }}>{errorMessage}</p>
    </div>
  );
}

export default App;
