import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import logo from './assets/lucas-image.jpg'

function App() {
  const [date, setDate] = useState(null);
  useEffect(() => {
    async function getDate() {
      const res = await fetch('/api/date');
      const newDate = await res.text();
      setDate(newDate);
    }
    getDate();
  }, []);
  
  return (
    <main>
      <h1>LucasBald Web</h1>

      <img src={logo} alt="Logo" class='logo-image'/>

      <h3>
        Engenheiro de Software
      </h3>
      <br />


      <p>
        <a
          href="https://www.linkedin.com/in/lbaldin/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Linkedin
        </a>
      </p>

      <p>
        <a
          href="https://github.com/lucasbald/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Github
        </a>
      </p>

      <br />
        
      <h2>The date according to Go is:</h2>
      <p>{date ? date : 'Loading date...'}</p>
    </main>
  );
}

export default App;
