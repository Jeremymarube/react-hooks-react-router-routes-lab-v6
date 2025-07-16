import "@testing-library/jest-dom";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import routes from "../routes";
import { vi } from "vitest";

// ✅ Mock movie data
const movieData = {
  id: 1,
  title: "Doctor Strange",
  time: 115,
  genres: ["Action", "Adventure", "Fantasy"]
};

test('renders the Home component on route "/"', () => {
  const router = createMemoryRouter(routes);
  render(<RouterProvider router={router} />);
  expect(screen.getByText(/Home Page/)).toBeInTheDocument();
});

test('renders the Actors component on route "/actors"', () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ['/actors']
  });
  render(<RouterProvider router={router} />);
  expect(screen.getByText(/Actors Page/)).toBeInTheDocument();
});

test('renders the Directors component on route "/directors"', () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ['/directors']
  });
  render(<RouterProvider router={router} />);
  expect(screen.queryByText(/Directors Page/)).toBeInTheDocument();
});

test('renders the Movie component on route "/movie/:id"', async () => {
  // ✅ Mock fetch response for movie
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    json: async () => movieData,
  });

  const router = createMemoryRouter(routes, {
    initialEntries: ["/movie/1"]
  });

  render(<RouterProvider router={router} />);
  expect(await screen.findByText(/Doctor Strange/)).toBeInTheDocument();

  // ✅ Restore fetch after test
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

