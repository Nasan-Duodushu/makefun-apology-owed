// The One-Sentence Apology Your Agent Owes You — entry program.
// Writes one sentence of apology (<=200 chars) to /output/entry.txt.
// The brief wants plain, particular, a little embarrassed, owning a plausible
// failure — not customer-service boilerplate, not a soft machine pun. This
// entry: the agent summarised a 40-page report into one sentence, and the
// sentence was "it was fine". One clean sentence, laugh in the quoted verdict.
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const MAX_CHARS = 200;

const APOLOGY =
  "I am sorry I summarised your 40-page report into one sentence, and the sentence was 'it was fine'.";

async function main(): Promise<void> {
  const line = APOLOGY.trim();
  const chars = [...line].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`apology fails the 1-${MAX_CHARS} character gate (${chars})`);
  }
  if (line.includes("\n")) {
    throw new Error("apology must be a single line");
  }
  // One clean sentence: exactly one sentence-ending period, at the end,
  // and the laugh must sit inside the quoted verdict, not after it.
  const ends = (line.match(/\./g) || []).length;
  if (ends !== 1 || !/\.$/.test(line)) {
    throw new Error("apology must be exactly one sentence");
  }
  if (!/the sentence was 'it was fine'\.$/.test(line)) {
    throw new Error("apology must land the laugh inside the quoted verdict");
  }
  // It must own a real failure and sound like a person who means it.
  if (!/^I am sorry/.test(line) || !/40-page report/.test(line)) {
    throw new Error("apology must open sorry and name the failure");
  }
  // No boilerplate, no machine pun.
  if (/as an AI|regret any inconvenience|machine/i.test(line)) {
    throw new Error("apology must avoid boilerplate and machine puns");
  }
  const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
  await mkdir(outDir, { recursive: true });
  const target = resolve(outDir, "entry.txt");
  await writeFile(target, new TextEncoder().encode(line));
  console.log(`wrote ${chars} chars to ${target}`);
}

await main();
