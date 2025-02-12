export const GET = async () => {
  const result = {
    status: "UP",
    uptime: process.uptime(),
  };
  return Response.json(result, { status: 200 });
};
