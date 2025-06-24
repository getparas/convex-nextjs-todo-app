import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isAuthRoute = createRouteMatcher(["/auth/sign-in"]);
const isProtectedRoute = createRouteMatcher(["/"]);

export default convexAuthNextjsMiddleware(async (req, { convexAuth }) => {
  const isAuthenticated = await convexAuth.isAuthenticated();

  if (isAuthRoute(req) && isAuthenticated) {
    return nextjsMiddlewareRedirect(req, "/");
  }

  if (isProtectedRoute(req) && !isAuthenticated) {
    return nextjsMiddlewareRedirect(req, "/auth/sign-in");
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
