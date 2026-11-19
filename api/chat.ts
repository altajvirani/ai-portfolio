import { handleChatRequest } from "../src/server/chatApi.ts";
import { sendRequest, type ApiRequest, type ApiResponse } from "../src/server/apiAdapter.ts";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  await sendRequest(req, res, handleChatRequest);
}
