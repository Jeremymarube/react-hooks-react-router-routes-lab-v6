import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import routes from "../routes";

// ✅ Mock movie data
const movies = [
  {
    id: 1,
    title: "Doctor Strange",
    time: 115,
    genres: ["Action", "Adventure", "Fantasy"]
  },
  {
    id: 2,
    title: "Trolls",
    time: 92,
    genres: ["Animation", "Comedy"]
  }
];

test("Displays links for each associated movie", async () => {
  // ✅ Mock fetch to return movies
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    json: async () => movies,
  });

  const router = createMemoryRouter(routes, {
    initialEntries: ["/"]
  });

  render(<RouterProvider router={router} />);

  const linkList = await screen.findAllByText(/View Info/);
  expect(linkList.length).toBeGreaterThan(1);
  expect(linkList[0].tagName).toBe("A");
  expect(linkList[0].href).toContain("/movie/1");

  vi.restoreAllMocks();
});
