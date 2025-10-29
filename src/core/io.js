const { stdin, stdout } = process;

export function handleInput(handler) {
  stdin.removeAllListeners("data");
  stdin.setRawMode(true);
  stdin.setEncoding("utf-8");

  stdin.on("data", (key) => {
    if (key === "\u0003") {
      process.exit();
    }
    handler(key);
  });
}
