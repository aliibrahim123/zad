import { highRes, lowRes, meduimRes } from "../src/backgrounds.js";
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
const max_content_per_pack = 1e5;
const UTF8Encoder = new TextEncoder();
const packs = {
  base: {
    type: "unpacked",
    version: "0.0.0",
    files: {
      ".": /[.]html/,
      "./styles": "all",
      "./internal/entries": "all",
      "./internal/entries/chunks": "all",
      "./assets/fonts": "all",
      "./assets/icons": "all"
    }
  },
  backLow: {
    type: "unpacked",
    version: "0.0.0",
    files: {
      "./assets/background": lowRes
    }
  },
  backMed: {
    type: "unpacked",
    version: "0.0.0",
    files: {
      "./assets/background": meduimRes
    }
  },
  backHigh: {
    type: "unpacked",
    version: "0.0.0",
    files: {
      "./assets/background": highRes
    }
  },
  quran: {
    type: "packed",
    version: "0.0.0",
    files: {
      "./internal/entries/sections": ["quran.js"],
      "./data/quran": "all"
    }
  }
};
const info = {};
await rm("./internal/contentPacks", { force: true, recursive: true });
await mkdir("./internal/contentPacks");
for (const name in packs) {
  const pack = packs[name];
  const files = [];
  for (const entry in pack.files) {
    const localFiles = (await readdir(entry, { withFileTypes: true })).filter((item) => item.isFile()).map((file) => file.name);
    const filter = pack.files[entry];
    let filtered;
    if (filter === "all") filtered = localFiles;
    else if (Array.isArray(filter)) filtered = filter;
    else if (typeof filter === "function") filtered = filter(localFiles);
    else filtered = localFiles.filter((file) => filter.test(file));
    files.push(...filtered.map((file) => `${entry}/${file}`));
  }
  await writeFile(`./internal/contentPacks/${name}.json`, JSON.stringify(files));
  if (pack.type === "unpacked") {
    const size = (await Promise.all(
      files.map(async (file) => (await stat(file)).size)
    )).reduce((a, b) => a + b);
    info[name] = { version: pack.version, size };
  } else {
    const content = await Promise.all(
      files.map(async (file) => [file, await readFile(file)])
    );
    let curChunk = [], curLength = 0;
    const chunks = [curChunk];
    for (const item of content) {
      curChunk.push(item);
      curLength += item[1].length;
      if (curLength > max_content_per_pack) {
        curLength = 0;
        curChunk = [];
        chunks.push(curChunk);
      }
    }
    let size = 0, chunkInd = 0;
    for (const chunk of chunks) {
      const buffer = [
        UTF8Encoder.encode("ZAD-CONTENT-PACK v1"),
        void 0,
        //table size
        void 0
        //table
      ];
      const table = {};
      let curInd = 0, tempBuffer;
      for (const [path, content2] of chunk) {
        curInd += 5;
        buffer.push(UTF8Encoder.encode("ITEM:"));
        tempBuffer = UTF8Encoder.encode(path);
        curInd += tempBuffer.length;
        buffer.push(tempBuffer);
        curInd += 1;
        buffer.push(UTF8Encoder.encode(":"));
        const offest = curInd;
        curInd += content2.length;
        buffer.push(content2);
        table[path] = [offest, curInd - offest];
      }
      const tableBuffer = UTF8Encoder.encode(JSON.stringify(table));
      buffer[1] = u32ToBuffer(tableBuffer.length);
      buffer[2] = tableBuffer;
      const finalBuffer = joinBuffers(buffer);
      size += finalBuffer.length;
      await writeFile(`./internal/contentPacks/${name}_${chunkInd++}.txt`, finalBuffer);
    }
    info[name] = { version: pack.version, size, chunks: chunks.length };
  }
}
await writeFile("./internal/contentPacks/info.json", JSON.stringify(info));
function u32ToBuffer(num) {
  return new Uint8Array([
    num >> 24 & 255,
    num >> 16 & 255,
    num >> 8 & 255,
    num & 255
  ]);
}
function joinBuffers(buffers) {
  let len = 0;
  for (const buf of buffers) len += buf.length;
  const result = new Uint8Array(len);
  let offset = 0;
  for (const buf of buffers) {
    result.set(buf, offset);
    offset += buf.length;
  }
  return result;
}
