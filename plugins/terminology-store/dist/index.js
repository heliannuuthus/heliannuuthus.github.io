// src/index.ts
import fs from "fs";
import path from "path";
var docusaurusPath = path.resolve(".docusaurus");
var glossaryPath = path.resolve(".docusaurus/glossary.json");
var TerminologyStore = class _TerminologyStore {
  constructor() {
    this.terms = {};
    this.updated = [];
    if (!fs.existsSync(docusaurusPath)) {
      fs.mkdirSync(docusaurusPath);
    }
    fs.writeFileSync(glossaryPath, "{}");
    this.terms = this.readGlossary();
    this.updated = Object.keys(this.terms);
  }
  addTerm(resourcePath, metadata) {
    this.terms[resourcePath] = metadata;
    fs.writeFileSync(glossaryPath, JSON.stringify(this.terms));
    this.setUpdatedResourcePath(resourcePath);
    return { resourcePath };
  }
  exists(resourcePath) {
    return this.terms[resourcePath] !== void 0;
  }
  readGlossary() {
    return JSON.parse(fs.readFileSync(glossaryPath, "utf8"));
  }
  setUpdatedResourcePath(resourcePath) {
    this.updated.push(resourcePath);
  }
  clearUpdatedResourcePaths() {
    this.updated = [];
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new _TerminologyStore();
    }
    return this.instance;
  }
};
var store = TerminologyStore.getInstance();
export { store };
//# sourceMappingURL=index.js.map
