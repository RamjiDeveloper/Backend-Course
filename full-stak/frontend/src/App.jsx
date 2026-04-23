import React, { useEffect, useState } from 'react'
import axios from 'axios'
// import { response } from 'express'

function App() {
  const [jokes, setJokes] = useState([])


  useEffect(() => {
    axios.get('/api/jokes')
    .then((response) => {
      setJokes(response.data)
    })
    .catch((Error) => {
      console.log(Error);
      
    })
  },[])
  return (
    <>
     <h1>Chai aur Code</h1> 
     <p>JOKES: {jokes.length}</p>

     {
      jokes.map((joke, index) => (
        <div key={joke.id}>
          <h3>{joke.title}</h3>
          <p>{joke.content}</p>
        </div>
      ))
     }
    </>
  )
}

export default App
