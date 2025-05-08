import { highRes, lowRes, meduimRes, pages } from "../src/backgrounds.js";
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
const max_content_per_pack = 25e4;
const UTF8Encoder = new TextEncoder();
const packs = {
  base: {
    type: "unpacked",
    version: "1.0.2",
    arabicName: "\u0623\u0633\u0627\u0633",
    files: {
      ".": /([.]html)|(manifest[.]json)/,
      "./styles": "all",
      "./internal/entries": "all",
      "./assets/fonts": "all",
      "./assets/icons": "all"
    }
  },
  monasabat: {
    type: "packed",
    version: "1.0.1",
    arabicName: "\u0645\u0646\u0627\u0633\u0628\u0627\u062A \u062F\u064A\u0646\u064A\u0629",
    files: {
      "./internal/entries/sections": ["monasabat.js"],
      "./data/monasabat": "all"
    }
  },
  backPage: {
    type: "unpacked",
    arabicName: "\u062E\u0644\u0641\u064A\u0627\u062A \u0648\u0631\u0642\u064A\u0629",
    version: "1.0.1",
    files: {
      "./assets/background": pages
    }
  },
  backLow: {
    type: "unpacked",
    arabicName: "\u062E\u0644\u0641\u064A\u0627\u062A \u062C\u0648\u062F\u0629 \u0645\u0646\u062E\u0641\u0636\u0629",
    version: "1.0.1",
    files: {
      "./assets/background": lowRes
    }
  },
  backMed: {
    type: "unpacked",
    version: "1.0.1",
    arabicName: "\u062E\u0644\u0641\u064A\u0627\u062A \u062C\u0648\u062F\u0629 \u0645\u062A\u0648\u0633\u0637\u0629",
    files: {
      "./assets/background": meduimRes
    }
  },
  backHigh: {
    type: "unpacked",
    version: "1.0.1",
    arabicName: "\u062E\u0644\u0641\u064A\u0627\u062A \u062C\u0648\u062F\u0629 \u0639\u0627\u0644\u064A\u0629",
    files: {
      "./assets/background": highRes
    }
  },
  quran: {
    type: "packed",
    version: "1.0.2",
    arabicName: "\u0642\u0631\u0622\u0646",
    files: {
      "./internal/entries/sections": ["quran.js"],
      "./data/quran": "all"
    }
  },
  tafseer: {
    type: "packed",
    version: "1.0.1",
    arabicName: "\u062A\u0641\u0633\u064A\u0631",
    files: {
      "./internal/entries/sections": ["mobeen.js"],
      "./data/mobeen": "all"
    }
  },
  quranTopics: {
    type: "packed",
    version: "1.0.1",
    arabicName: "\u0645\u0648\u0636\u0648\u0639\u0627\u062A \u0627\u0644\u0642\u0631\u0627\u0646 \u0627\u0644\u0643\u0631\u064A\u0645",
    files: {
      "./internal/entries/sections": ["quranTopics.js"],
      "./data/quranTopics": "all"
    }
  },
  quranInfo: {
    type: "packed",
    version: "1.0.1",
    arabicName: "\u0645\u0642\u062A\u0637\u0641\u0627\u062A \u0642\u0631\u0622\u0646\u064A\u0629",
    files: {
      "./internal/entries/sections": ["quranInfo.js"],
      "./data/quranInfo": "all"
    }
  },
  amal: {
    type: "packed",
    version: "1.0.1",
    arabicName: "\u0642\u0633\u0645 \u0627\u0644\u0623\u0639\u0645\u0627\u0644",
    files: {
      "./internal/entries/sections": ["saaat.js", "osboa.js", "months.js"],
      "./data/months": "all",
      "./data/osboa": "all",
      "./data/saaat": "all"
    }
  },
  doaa: {
    type: "packed",
    version: "1.0.1",
    arabicName: "\u0642\u0633\u0645 \u0627\u0644\u062F\u0639\u0627\u0621",
    files: {
      "./internal/entries/sections": ["doaa.js", "sala.js"],
      "./data/doaa": "all",
      "./data/sala": "all"
    }
  },
  ziara: {
    type: "packed",
    version: "1.0.1",
    arabicName: "\u0642\u0633\u0645 \u0627\u0644\u0632\u064A\u0627\u0631\u0627\u062A",
    files: {
      "./internal/entries/sections": ["ziara.js"],
      "./data/ziara": "all"
    }
  },
  sera: {
    type: "packed",
    version: "1.0.1",
    arabicName: "\u0633\u064A\u0631\u0629 \u0623\u0647\u0644 \u0627\u0644\u0628\u064A\u062A",
    files: {
      "./internal/entries/sections": ["sera.js"],
      "./data/sera": "all"
    }
  },
  aqwal: {
    type: "packed",
    version: "1.0.1",
    arabicName: "\u062D\u0643\u0645 \u0648\u062F\u064A\u0648\u0627\u0646",
    files: {
      "./internal/entries/sections": ["aliWord.js", "shorts.js", "dewan.js"],
      "./data/aliWord": "all",
      "./data/shorts": "all",
      "./data/dewan": "all"
    }
  },
  ibooks: {
    type: "packed",
    version: "1.0.1",
    arabicName: "\u0643\u062A\u0628 \u0627\u0647\u0644 \u0627\u0644\u0628\u064A\u062A",
    files: {
      "./internal/entries/sections": ["ibooks.js", "nahij.js"],
      "./data/ibooks": "all",
      "./data/nahij": "all"
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
    info[name] = { version: pack.version, size, arabicName: pack.arabicName };
  } else {
    console.log(`packing ${name}`);
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
    info[name] = { version: pack.version, size, arabicName: pack.arabicName, chunks: chunks.length };
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
