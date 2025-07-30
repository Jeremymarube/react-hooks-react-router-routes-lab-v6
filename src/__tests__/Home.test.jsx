import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import routes from "../routes";

// Sample movie data
const movies = [
  {
    id: 1,
    title: "Doctor Strange",
    time: 115,
    genres: ["Action", "Adventure", "Fantasy"],
  },
  {
    id: 2,
    title: "Trolls",
    time: 92,
    genres: ["Animation", "Comedy"],
  },
];

// Restore mocks after each test
afterEach(() => {
  vi.restoreAllMocks();
});

test("Displays links for each associated movie", async () => {
  // Mock fetch to return movie data
  vi.spyOn(global, "fetch").mockResolvedValue({
    json: async () => movies,
  });

  const router = createMemoryRouter(routes, {
    initialEntries: ["/"], // Go to Home route
  });

  render(<RouterProvider router={router} />);

  // Confirm each movie has a "View Info" link (as in MovieCard)
  const linkList = await screen.findAllByText(/View Info/);
  expect(linkList.length).toBe(2);
  expect(linkList[0].tagName).toBe("A");
  expect(linkList[0].getAttribute("href")).toBe("/movie/1");
});
