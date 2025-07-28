export function middleware() {
    console.log("Hello world");
}

export const config = {
    matcher: '/:path*',
}