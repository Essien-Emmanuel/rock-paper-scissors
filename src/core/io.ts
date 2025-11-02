import process from "node:process";

const { stdin, stdout, exit } = process;

export function handleInput(handler: any) {
  stdin.removeAllListeners("data");
  stdin.setRawMode(true);
  stdin.setEncoding("utf-8");

  stdin.on("data", (key: string) => handler(key));
}

export function print(str: string) {
  stdout.write(str);
  return;
}

export const exitProgram = exit;
