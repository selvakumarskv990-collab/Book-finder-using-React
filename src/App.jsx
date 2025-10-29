import React from 'react'
import BookSearch from './components/BookSearch'

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Book Finder</h1>
        <p className="subtitle">Search books using the Open Library.</p>
      </header>

      <main>
        <BookSearch />
      </main>

      <footer className="footer">
        <small> Book Search using Open Library API </small><br />
        <small>Creted by Selvakumar V</small>
      </footer>
    </div>
  )
}
