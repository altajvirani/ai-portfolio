export interface ApiRequest {
  method: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}

export interface ApiResponse {
  status(code: number): ApiResponse;
  setHeader(name: string, value: string | string[]): void;
  send(body: string): void;
}

function getRequestUrl(request: ApiRequest) {
  const protocol = typeof request.headers["x-forwarded-proto"] === "string"
    ? request.headers["x-forwarded-proto"]
    : "https";
  const host = typeof request.headers.host === "string" ? request.headers.host : "localhost";
  return `${protocol}://${host}${request.url || "/"}`;
}

export async function sendRequest(
  request: ApiRequest,
  response: ApiResponse,
  handler: (request: Request) => Promise<Response>,
) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(request.headers)) {
    if (typeof value === "string") headers.set(key, value);
    if (Array.isArray(value)) headers.set(key, value.join(", "));
  }
  const body = request.method === "GET" || request.method === "HEAD"
    ? undefined
    : JSON.stringify(request.body ?? {});
  const result = await handler(
    new Request(getRequestUrl(request), { method: request.method, headers, body }),
  );
  response.status(result.status);
  const setCookies = result.headers.getSetCookie?.() || [];
  result.headers.forEach((value, key) => {
    if (key !== "set-cookie") response.setHeader(key, value);
  });
  if (setCookies.length > 0) response.setHeader("Set-Cookie", setCookies);
  response.send(await result.text());
}
