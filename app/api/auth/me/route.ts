import { getCurrentUser } from "@/lib/auth";
import { success, error } from "@/lib/api-response";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return error("Not authenticated", 401);
    return success({ userId: user.userId, email: user.email, name: user.name, role: user.role });
  } catch {
    return error("Internal server error", 500);
  }
}
