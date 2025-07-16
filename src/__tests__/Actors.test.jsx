import "@testing-library/jest-dom";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import routes from "../routes";
import { vi } from "vitest"; // needed for mocking fetch

// Test data: matches what the app expects
const actors = [
  {
    name: "Benedict Cumberbatch",
    movies: ["Doctor Strange", "The Imitation Game", "Avengers: Endgame"],
  },
  {
    name: "Chiwetel Ejiofor",
    movies: ["12 Years a Slave", "Doctor Strange", "The Lion King"],
  },
  {
    name: "Rachel McAdams",
    movies: ["Mean Girls", "Doctor Strange", "The Notebook"],
  },
];

// ✅ Mock fetch before each test
beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(actors),
    })
  );
});

// ✅ Restore fetch after tests
afterEach(() => {
  vi.restoreAllMocks();
});

const router = createMemoryRouter(routes, {
  initialEntries: [`/actors`],
  initialIndex: 0,
});

test("renders 'Actors Page' inside of a <h1 />", async () => {
  render(<RouterProvider router={router} />);
  const h1 = await screen.findByText(/Actors Page/);
  expect(h1).toBeInTheDocument();
  expect(h1.tagName).toBe("H1");
});

test("renders each actor's name", async () => {
  render(<RouterProvider router={router} />);
  for (const actor of actors) {
    expect(await screen.findByText(actor.name)).toBeInTheDocument();
  }
});

test("renders a <li /> for each movie", async () => {
  render(<RouterProvider router={router} />);
  for (const actor of actors) {
    for (const movie of actor.movies) {
      const listItems = await screen.findAllByText(movie, { exact: false });
      expect(listItems.length).toBeGreaterThan(0);
      listItems.forEach((li) => {
        expect(li).toBeInTheDocument();
        expect(li.tagName).toBe("LI");
      });
    }
  }
});


test("renders the <NavBar /> component", () => {
  render(<RouterProvider router={router} />);
  expect(document.querySelector(".navbar")).toBeInTheDocument();
});

