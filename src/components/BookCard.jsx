import React from 'react'

function getCoverUrl(cover_i) {
  if (!cover_i) return 'https://via.placeholder.com/150x220?text=No+Cover'
  return `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`
}

export default function BookCard({ book, onMore, onToggleFavorite, isFavorite }) {
  const authors = book.author_name ? book.author_name.join(', ') : 'Unknown author'
  const title = book.title || 'No title'
  const year = book.first_publish_year || '—'

  return (
    <article className="book-card">
      <img src={getCoverUrl(book.cover_i)} alt={`Cover for ${title}`} className="cover"/>
      <div className="book-info">
        <h4 className="book-title">{title}</h4>
        <p className="book-authors">{authors}</p>
        <p className="book-year">First published: {year}</p>

        <div className="book-actions">
          <button className="btn" onClick={() => onMore(book)}>See</button>
          <button
            className={`btn btn-fav ${isFavorite ? 'active' : ''}`}
            onClick={() => onToggleFavorite(book)}
            aria-pressed={isFavorite}
          >
            {isFavorite ? 'Unfavorite' : 'Favorite'}
          </button>
        </div>
      </div>
    </article>
  )
}


