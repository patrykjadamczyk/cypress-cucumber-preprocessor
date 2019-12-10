const glob = require("glob");
const cosmiconfig = require("cosmiconfig");
const path = require("path");
const stepDefinitionPath = require("./stepDefinitionPath.js");
const { getStepDefinitionPathsFrom } = require("./getStepDefinitionPathsFrom");

const getStepDefinitionsPaths = filePath => {
  let paths = [];
  const explorer = cosmiconfig("cypress-cucumber-preprocessor", { sync: true });
  const loaded = explorer.load();
  if (loaded && loaded.config && loaded.config.nonGlobalStepDefinitions) {
    const nonGlobalPattern = `${getStepDefinitionPathsFrom(filePath)}.+(js|ts)`;
    let commonPath =
      loaded.config.commonPath || `${stepDefinitionPath()}/common/`;
    commonPath = path.resolve(process.cwd(), commonPath);
    const commonDefinitionsPattern = `${commonPath}**/*.+(js|ts)`;
    paths = paths.concat(glob.sync(nonGlobalPattern));
    paths = paths.concat(glob.sync(commonDefinitionsPattern));
  } else {
    const pattern = `${stepDefinitionPath()}/**/*.+(js|ts)`;
    paths = paths.concat(glob.sync(pattern));
  }
  // console.warn('Resolving paths for', filePath, 'Paths of found step definitions', paths);
  return paths;
};

module.exports = { getStepDefinitionsPaths };
