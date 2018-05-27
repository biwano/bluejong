const argparse = require('argparse');
const fs = require('fs');
const merge = require('merge');

const parser = new argparse.ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Argparse example',
});
parser.addArgument(
  ['-s', '--source'],
  {
    help: 'foo bar',
  },
);
parser.addArgument(
  ['-m', '--modifier'],
  {
    help: 'bar foo',
  },
);
parser.addArgument(
  ['-d', '--destination'],
  {
    help: 'baz bar',
  },
);
const args = parser.parseArgs();

const copy = function copy(config_, modifier) {
  const config = config_;
  if (typeof modifier === 'object') {
    const keys = Object.keys(modifier);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      config[key] = copy(config[key], modifier[key]);
    }
  } else {
    return modifier;
  }
  return config;
};
const configure = function configure(configFileName, modifierFileName, destinationFileName) {
  let config = require(configFileName);
  const modifier = require(modifierFileName);
  config = copy(config, modifier);
  const destination = `module.exports = ${JSON.stringify(config)}`;
  fs.writeFileSync(destinationFileName, destination, 'utf-8');
};

configure(
  args.source,
  args.modifier,
  args.destination,
);

