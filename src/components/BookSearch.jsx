import React, { useState, useEffect, useCallback } from 'react'
import { debounce, buildSearchUrl } from '../utils'
import BookCard from './BookCard'
import Modal from './Modal'

const RESULTS_PER_PAGE = 12

export default function BookSearch() {
  const [query, setQuery] = useState('')
  const [author, setAuthor] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [books, setBooks] = useState([])
  const [numFound, setNumFound] = useState(0)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bf_favs') || '[]')
    } catch (e) {
      return []
    }
  })

  // keep favorites in localStorage
  useEffect(() => {
    localStorage.setItem('bf_favs', JSON.stringify(favorites))
  }, [favorites])

  const isFavorited = (doc) => favorites.some(f => f.key === doc.key)

  const toggleFavorite = (doc) => {
    if (isFavorited(doc)) {
      setFavorites(prev => prev.filter(f => f.key !== doc.key))
    } else {
      setFavorites(prev => [doc, ...prev])
    }
  }

  const fetchBooks = useCallback(async ({ qTitle, qAuthor, qPage }) => {
    if (!qTitle && !qAuthor) {
      setBooks([])
      setNumFound(0)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const url = buildSearchUrl({ title: qTitle, author: qAuthor, page: qPage, limit: RESULTS_PER_PAGE })
      const res = await fetch(url)
      if (!res.ok) throw new Error('Network response was not ok')
      const data = await res.json()
      setBooks(data.docs || [])
      setNumFound(data.numFound || 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // debounced search
  // note: we intentionally create a stable debounced function so typing doesn't overfetch
  const debouncedSearch = useCallback(debounce(({ t, a, p }) => fetchBooks({ qTitle: t, qAuthor: a, qPage: p })), [fetchBooks])

  useEffect(() => {
    setPage(1)
    debouncedSearch({ t: query, a: author, p: 1 })
  }, [query, author, debouncedSearch])

  useEffect(() => {
    // fetch when page changes
    fetchBooks({ qTitle: query, qAuthor: author, qPage: page })
  }, [page])

  const onMore = (book) => setSelected(book)
  const onCloseModal = () => setSelected(null)

  const totalPages = Math.ceil(numFound / RESULTS_PER_PAGE) || 1

  return (
    <section className="search-section">
      <div className="controls">
        <div className="input-row">
          <label>
            <span className="label">Title</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title (e.g. Pride and Prejudice)" />
          </label>

          <label>
            <span className="label">Author (optional)</span>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Filter by author" />
          </label>
        </div>

        <div className="extras">
          <div>Results: <strong>{numFound}</strong></div>
          <div>Page: {page} / {totalPages}</div>
        </div>
      </div>

      <div className="results">
        {loading && <div className="loading">Loading…</div>}
        {error && <div className="error">Error: {error}</div>}

        {!loading && !error && books.length === 0 && (
          <div className="empty">Start typing a title to search for books.</div>
        )}

        <div className="grid">
          {books.map(book => (
            <BookCard
              key={book.key}
              book={book}
              onMore={onMore}
              onToggleFavorite={toggleFavorite}
              isFavorite={isFavorited(book)}
            />
          ))}
        </div>

        <div className="pagination">
          <button className="btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
          <button className="btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</button>
        </div>

        <section className="favorites">
          <h3>Favorites</h3>
          {favorites.length === 0 && <div className="muted">No favorites yet — click "Favorite" on a book.</div>}
          <div className="fav-list">
            {favorites.map(f => (
              <div key={f.key} className="fav-item">
                <img src={f.cover_i ? `https://covers.openlibrary.org/b/id/${f.cover_i}-S.jpg` : 'https://via.placeholder.com/50x70?text=No+Cover'} alt="fav cover"/>
                <div className="fav-meta">
                  <div className="fav-title">{f.title}</div>
                  <div className="fav-author">{(f.author_name || []).slice(0,2).join(', ')}</div>
                </div>
                <button className="btn btn-small" onClick={() => toggleFavorite(f)}>Remove</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Modal open={!!selected} onClose={onCloseModal} title={selected ? selected.title : ''}>
        {selected && (
          <div className="modal-details">
            <img src={selected.cover_i ? `https://covers.openlibrary.org/b/id/${selected.cover_i}-L.jpg` : 'https://via.placeholder.com/200x300?text=No+Cover'} alt="cover"/>
            <div className="meta">
              <h4>{selected.title}</h4>
              <p><strong>Author:</strong> {(selected.author_name || []).join(', ')}</p>
              <p><strong>First published:</strong> {selected.first_publish_year || '—'}</p>
              <p><strong>Subjects:</strong> {(selected.subject || []).slice(0,10).join(', ') || '—'}</p>
              <p><a href={`https://openlibrary.org${selected.key}`} target="_blank" rel="noreferrer">View on OpenLibrary</a></p>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}


