// The one place that talks to the network. Every module loads data through fetchJson.

// Where the API lives. Set VITE_API_BASE_URL in a .env file (see .env.example)
// to load the data from another server, e.g. https://api.example.com/v1/.
// Without it, paths start from the page, as before. Under node --test there is
// no import.meta.env, hence the ?.
const API_BASE_URL: string = import.meta.env?.VITE_API_BASE_URL ?? "";

// Puts the base in front of a path, with exactly one "/" between them.
// A full URL (https://…) is used as it is, and so is any path when there is no base.
export function resolveApiUrl(path: string, base: string = API_BASE_URL): string {
  if (base === "" || /^[a-z][a-z\d+.-]*:/i.test(path)) return path;
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

// An error with the details a caller needs to decide what to show.
// status is the HTTP status, or 0 when the request never reached the server.
export class ApiError extends Error {
  readonly status: number;
  readonly url: string;

  constructor(message: string, status: number, url: string, cause?: unknown) {
    super(message, { cause });
    this.name = "ApiError";
    this.status = status;
    this.url = url;
  }
}

// Loads a URL (a path is put after the API base first) and returns its JSON body as T.
// T is only a promise to TypeScript, the JSON itself is not checked here.
// When the shape matters, ask for `unknown` and check it (see products.api.ts).
export async function fetchJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = resolveApiUrl(path);
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (cause) {
    throw new ApiError(`Network error while loading ${url}`, 0, url, cause);
  }

  if (!response.ok) {
    throw new ApiError(
      `Request for ${url} failed: ${response.status} ${response.statusText}`,
      response.status,
      url,
    );
  }

  try {
    // response.json() is typed as `any`, so this line is where the body becomes T.
    // T is only a promise to TypeScript (see above): callers that care ask for
    // `unknown` and check it.
    const body: T = await response.json();
    return body;
  } catch (cause) {
    throw new ApiError(
      `${url} did not return valid JSON`,
      response.status,
      url,
      cause,
    );
  }
}
