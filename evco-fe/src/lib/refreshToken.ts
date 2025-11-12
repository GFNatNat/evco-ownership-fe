import axios from "axios";
import Cookies from "js-cookie";

export async function refreshToken() {
  try {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) throw new Error("No refresh token");

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Auth/refresh`,
      { refreshToken }
    );

    const newAccessToken = res?.data?.data?.accessToken;
    const newRefreshToken = res?.data?.data?.refreshToken;

    if (!newAccessToken) throw new Error("No new access token");

    const cookieName = process.env.NEXT_PUBLIC_AUTH_COOKIE ?? "accessToken";

    // Cập nhật access token cookie
    Cookies.set(cookieName, newAccessToken, {
      sameSite: "lax",
      path: "/",
    });

    // Cập nhật refresh token cookie nếu backend có gửi mới
    if (newRefreshToken) {
      Cookies.set("refreshToken", newRefreshToken, {
        sameSite: "lax",
        path: "/",
      });
    }

    return newAccessToken;
  } catch (err) {
    console.error("Refresh token failed:", err);
    // Nếu lỗi, xoá cookie để logout
    Cookies.remove(process.env.NEXT_PUBLIC_AUTH_COOKIE ?? "accessToken");
    Cookies.remove("refreshToken");
    window.location.href = "/login";
    return null;
  }
}
