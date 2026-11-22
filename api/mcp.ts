import { handleMcpRequest } from "./_lib/mcpHttpHandler.ts";
import { sendRequest, type ApiRequest, type ApiResponse } from "./_lib/apiAdapter.ts";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  await sendRequest(req, res, handleMcpRequest);
}
