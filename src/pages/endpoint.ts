export function GET() {
  return new Response(
    JSON.stringify({
      message: "Hello from endpoint",
    }),
    { status: 200 },
  );
}
