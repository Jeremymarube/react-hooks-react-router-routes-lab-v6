import "@testing-library/jest-dom";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import routes from "../routes";
import { vi } from "vitest";

// ✅ Shared mock movie data for the /movie/:id route
const movieData = {
  id: 1,
  title: "Doctor Strange",
  time: 115,
  genres: ["Action", "Adventure", "Fantasy"]
};

test('renders the Home component on route "/"', async () => {
  // ✅ Mock fetch for the Home page
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    json: async () => [
      { id: 1, title: "Inception" },
      { id: 2, title: "The Matrix" }
    ]
  });

  const router = createMemoryRouter(routes, {
    initialEntries: ["/"]
  });

  render(<RouterProvider router={router} />);

  // ✅ Await content to ensure async fetch resolves
  expect(await screen.findByText(/Home Page/)).toBeInTheDocument();
  expect(await screen.findByText("Inception")).toBeInTheDocument();
  expect(await screen.findByText("The Matrix")).toBeInTheDocument();

  vi.restoreAllMocks();
});

test('renders the Actors component on route "/actors"', async () => {
  // ✅ Mock fetch for actors route
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    json: async () => [
      {
        name: "Benedict Cumberbatch",
        movies: ["Doctor Strange", "The Imitation Game"]
      },
      {
        name: "Rachel McAdams",
        movies: ["Mean Girls", "The Notebook"]
      }
    ]
  });

  const router = createMemoryRouter(routes, {
    initialEntries: ["/actors"]
  });

  render(<RouterProvider router={router} />);

  expect(await screen.findByText(/Actors Page/)).toBeInTheDocument();
  expect(await screen.findByText("Benedict Cumberbatch")).toBeInTheDocument();
  expect(await screen.findByText("Rachel McAdams")).toBeInTheDocument();

  vi.restoreAllMocks();
});

test('renders the Directors component on route "/directors"', () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ["/directors"]
  });

  render(<RouterProvider router={router} />);

  expect(screen.getByText(/Directors Page/)).toBeInTheDocument();
});

test('renders the Movie component on route "/movie/:id"', async () => {
  // ✅ Mock fetch response for movie
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    json: async () => movieData
  });

  const router = createMemoryRouter(routes, {
    initialEntries: ["/movie/1"]
  });

  render(<RouterProvider router={router} />);

  expect(await screen.findByText(/Doctor Strange/)).toBeInTheDocument();
  expect(await screen.findByText(/Action/)).toBeInTheDocument();
  expect(await screen.findByText(/Adventure/)).toBeInTheDocument();
  expect(await screen.findByText(/Fantasy/)).toBeInTheDocument();

  vi.restoreAllMocks();
});

test("renders an error page when given a bad URL", () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ["/bad-route"]
  });

  render(<RouterProvider router={router} />);
  expect(
    screen.getByText(/Oops! Looks like something went wrong./)
  ).toBeInTheDocument();
});
