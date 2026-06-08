require("dotenv").config();
const app = require("./app");

const DEFAULT_PORT = Number(process.env.PORT || 3001);
const MAX_PORT_RETRIES = 10;

function listen(port, retriesLeft) {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE" && retriesLeft > 0 && !process.env.PORT) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is in use. Trying ${nextPort}...`);
      listen(nextPort, retriesLeft - 1);
      return;
    }

    if (err.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use. Set PORT to another value or stop the existing server.`);
      process.exit(1);
    }

    throw err;
  });

  return server;
}

if (require.main === module) {
  if (!process.env.JWT_SECRET) {
    console.error("Fatal: JWT_SECRET is not set");
    process.exit(1);
  }
  listen(DEFAULT_PORT, MAX_PORT_RETRIES);
}

module.exports = app;
