import { verifyToken, signToken, setAuthCookie, getAuthToken, clearAuthCookie } from "@/lib/auth";
import { success, error } from "@/lib/api-response";

export async function POST() {
  try {
    const token = await getAuthToken();
    if (!token) {
      return error("Not authenticated", 401);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      await clearAuthCookie();
      return error("Invalid token", 401);
    }

    const newToken = await signToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    await setAuthCookie(newToken);

    return success({ refreshed: true });
  } catch (e) {
    console.error("Refresh error:", e);
    return error("Internal server error", 500);
  }
}
