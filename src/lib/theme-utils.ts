export type Theme = "light" | "dark";

export const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light"; // Default to light on server
  }

  // Check localStorage first
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  // Fall back to system preference
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
};

export const applyTheme = (theme: Theme): void => {
  if (typeof window === "undefined") return;

  const root = document.documentElement;

  // Remove dark class first
  root.classList.remove("dark");

  // Add dark class only if theme is dark (Tailwind CSS works this way)
  if (theme === "dark") {
    root.classList.add("dark");
  }

  // Set data attribute for additional CSS targeting if needed
  root.setAttribute("data-theme", theme);

  console.log(
    `Applied theme: ${theme}, has dark class: ${root.classList.contains(
      "dark"
    )}`
  ); // Debug log
};

export const saveTheme = (theme: Theme): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem("theme", theme);
};
