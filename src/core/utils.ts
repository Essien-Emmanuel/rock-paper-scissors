import fs from "node:fs/promises";
import path from "node:path";

const __dirname = import.meta.dirname;

const fileBasePath = "../../storage";

export async function writeToFile(filename: string, data: Record<string, any>) {
  try {
    const fp = path.join(__dirname, `${fileBasePath}/${filename}.json`);
    const dataStr = JSON.stringify(data);
    await fs.writeFile(fp, dataStr);
  } catch (error) {
    console.error(error);
  }
  return;
}

export async function readTheFile(filename: string) {
  const fp = path.join(__dirname, `${fileBasePath}/${filename}.json`);
  try {
    const dataStr = await fs.readFile(fp);
    return JSON.parse(dataStr.toString());
  } catch (error) {}
  return null;
}
