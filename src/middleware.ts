import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
      await auth.protect()
    }
  })
  

export const config = {
  matcher: [
    "/input/(.*)",  //  Protect ALL pages inside /input/
    "/((?!_next|.*\\..*).*)",  // Protect other app pages, skip static files
    "/(api|trpc)(.*)",        //  Protect API routes
  ],
};
