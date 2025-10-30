import process from "node:process";

const { stdin, stdout } = process;

export function handleInput(handler: any) {
  stdin.removeAllListeners("data");
  stdin.setRawMode(true);
  stdin.setEncoding("utf-8");

  stdin.on("data", (key: string) => {
    if (key === "\u0003") {
      process.exit();
    }
    handler(key);
  });
}
