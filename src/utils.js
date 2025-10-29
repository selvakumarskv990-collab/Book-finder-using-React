// simple debounce helper
export function debounce(fn, delay = 400) {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), delay)
  }
}

// build Open Library search URL
export function buildSearchUrl({ title = '', author = '', page = 1, limit = 12 }) {
  // OpenLibrary supports 'page' parameter; limit will be used via 'limit'
  const encodedTitle = encodeURIComponent(title.trim())
  const encodedAuthor = encodeURIComponent(author.trim())
  let q = ''
  if (title) q += `title=${encodedTitle}`
  if (author) q += `${q ? '&' : ''}author=${encodedAuthor}`

  // page starts at 1
  return `https://openlibrary.org/search.json?${q}&page=${page}&limit=${limit}`
}


