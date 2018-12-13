#!/usr/bin/env ./node_modules/.bin/babel-node

import local from 'import-local';
import npmlog from 'npmlog';
import iface from '.';

if (local(__filename)) {
  npmlog.info('cli', 'using local version of monopia');
} else {
  iface(process.argv.slice(2));
}
