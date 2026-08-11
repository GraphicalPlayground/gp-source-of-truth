// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground.com/legal
// mailto:support AT graphical-playground DOT com

import fs from 'node:fs';
import Handlebars from 'handlebars';
import { helpers } from './helpers';
import { loadConfig } from './config';
import path from 'node:path';

// Registers all helper functions with Handlebars.
Object.keys(helpers).forEach((helper) => {
  Handlebars.registerHelper(helper, helpers[helper]);
});

// Load the configuration from the specified directory.
const config = loadConfig(path.resolve('config'));

const templateSource = fs.readFileSync('test.hbs', 'utf8');
const template = Handlebars.compile(templateSource);

// 2. Inject context (e.g. GitHub actions environment variables)
const rendered = template({
  github: {
    repository: process.env.GITHUB_REPOSITORY || 'my-org/my-repo',
    owner: process.env.GITHUB_REPOSITORY_OWNER || 'my-org'
  },
  overridden_content: 'This section is unique to this repository.',
  ...config
});

// 3. Write final output
fs.writeFileSync('tests.md', rendered);
