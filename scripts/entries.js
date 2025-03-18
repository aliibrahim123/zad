const entryMap = {
  libs: "",
  base: "",
  root: "",
  fahras: "",
  viewer: "",
  quranViewer: "",
  sw: "",
  settingsPage: "",
  download: "",
  aboutDay: "",
  masbaha: "",
  sections: {
    quran: "",
    doaa: "",
    saaat: "",
    osboa: "",
    months: "",
    ziara: "",
    mobeen: "",
    monasabat: "",
    sera: "",
    sala: "",
    quranTopics: "",
    quranInfo: "",
    shorts: "",
    aliWord: "",
    dewan: "",
    nahij: "",
    ibooks: ""
  }
};
const entries = [];
function flatternEntry(entry, path = "") {
  path = path === "" ? "" : path + "/";
  for (const name in entry) {
    const subEntry = entry[name];
    if (subEntry === "") entries.push(path + name);
    else flatternEntry(subEntry, path + name);
  }
}
flatternEntry(entryMap);
const entriesFull = entries.map((entry) => `src/${entry}.ts`);
const entriesFullSet = new Set(entriesFull);
export {
  entries,
  entriesFull,
  entriesFullSet
};
