// The environment variables this app reads (from .env files, see .env.example).
// Vite only exposes names that start with VITE_.
interface ImportMetaEnv {
  // Where the API lives, e.g. https://api.example.com/v1/. Not set: paths start from the page.
  readonly VITE_API_BASE_URL?: string;
}
