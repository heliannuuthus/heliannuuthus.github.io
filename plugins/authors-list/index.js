import path from "path";
import fs from "fs";
import yaml from "js-yaml";

export default async function authorsListPlugin(context, ops) {
  return {
    name: "docusaurus-plugin-authors-list",
    async loadContent() {
      // 读取 YAML 文件
      const authorsPath = path.join(context.siteDir, ops.path);
      const authorsYaml = fs.readFileSync(authorsPath, "utf8");
      const authors = yaml.load(authorsYaml);

      return {
        authors,
      };
    },

    async contentLoaded({content, actions}) {
      const {setGlobalData} = actions;
      // 设置全局数据
      setGlobalData({
        authors: content.authors,
      });
    },
  };
};