import * as readline from "readline";

export function getInput(promptMessage = ""): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal:true,
  });

  return new Promise((resolve) => {
    rl.question(promptMessage, (input) => {
      rl.close();
      resolve(input.trim());
    });
  });
}
