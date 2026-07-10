const net = require("net");

const client = new net.Socket();
client.setTimeout(2000);

console.log("Checking port 27017...");
client.connect(27017, "127.0.0.1", () => {
  console.log("Port 27017 is open! MongoDB is likely running.");
  client.destroy();
  process.exit(0);
});

client.on("error", (err) => {
  console.error("Port 27017 is closed. MongoDB is not running.", err.message);
  process.exit(1);
});

client.on("timeout", () => {
  console.error("Connection to port 27017 timed out.");
  process.exit(1);
});
