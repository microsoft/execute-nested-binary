#!/usr/bin/env node

const { spawn } = require('child_process');
const { existsSync } = require('fs');
const { resolve, delimiter, sep } = require('path');

const getNodeBinaryFolders = fromDir => {
  const parts = fromDir.split(sep);

  return parts
    .map((_segment, i) =>
      parts
        .slice(0, i + 1)
        .concat('node_modules', '.bin')
        .join(sep),
    )
    .filter(path => existsSync(path))
    .reverse();
};

const locate = binary => {
  const location = getNodeBinaryFolders(process.cwd()).find(folder =>
    existsSync(resolve(folder, binary)),
  );
  if (!location) {
    console.error('Binary not found');
    process.exit(1);
  } else {
    console.log(location);
    process.exit(0);
  }
};

const executeScript = (binary, args) => {
  const script = spawn(binary, args, {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: {
      ...process.env,
      PATH: [process.env.PATH, ...getNodeBinaryFolders(process.cwd())].join(delimiter),
    },
    shell: true,
  });

  script.on('error', err => {
    console.error(`Error running script: ${err.stack || err}`);
    process.exit(1);
  });

  script.on('close', code => process.exit(code));
};

(() => {
  if (require.main !== module) {
    return;
  }

  if (process.argv.length <= 2) {
    console.log('Usage: node-ex [--where] <command> [args...]');
    return;
  }

  if (process.argv[2] === '--where') {
    locate(process.argv[3]);
  }

  executeScript(process.argv[2], process.argv.slice(3));
})();
