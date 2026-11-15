import { handleAdminRequest } from "../../src/server/adminAuth.ts";
import { sendRequest, type ApiRequest, type ApiResponse } from "../../src/server/apiAdapter.ts";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  await sendRequest(req, res, handleAdminRequest);
}
