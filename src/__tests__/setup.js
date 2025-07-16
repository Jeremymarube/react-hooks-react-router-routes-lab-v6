import { vi } from 'vitest'

// Sample test data
const movies = [
  {
    id: 1,
    title: "Doctor Strange",
    time: 115,
    genres: ["Action", "Adventure", "Fantasy"],
  },
  {
    id: 2,
    title: "Blood Diamond",
    time: 143,
    genres: ["Drama", "Thriller", "War"],
  },
]

const actors = [
  {
    name: "Benedict Cumberbatch",
    movies: ["Doctor Strange", "The Imitation Game"],
  },
]

const directors = [
  {
    name: "Scott Derrickson",
    movies: ["Doctor Strange", "Sinister", "The Exorcism of Emily Rose"],
  },
]

// Global fetch mock
beforeEach(() => {
  global.fetch = vi.fn((url) => {
    if (url.includes("/movies")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(movies),
      })
    }

    if (url.includes("/actors")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(actors),
      })
    }

    if (url.includes("/directors")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(directors),
      })
    }

    return Promise.reject(new Error("Unhandled fetch request: " + url))
  })
})

// Restore after each test to keep mocks clean
afterEach(() => {
  vi.restoreAllMocks()
})

