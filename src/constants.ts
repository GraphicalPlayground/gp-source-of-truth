// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground.com/legal
// mailto:support AT graphical-playground DOT com

import fs from 'node:fs';
import path from 'node:path';

export const TEMPLATES_DIR = path.resolve(__dirname, '../templates');
export const CONFIG_DIR = path.resolve(__dirname, '../config');
export const SCHEMAS_DIR = path.resolve(__dirname, '../schemas');

export const LICENSES_DIR = path.join(TEMPLATES_DIR, 'licenses');
export const TRANSLATIONS_DIR = path.join(TEMPLATES_DIR, 'translations');
export const LOCALES_METADATA_PATH = path.join(TRANSLATIONS_DIR, 'locales.json');

export const AVAILABLE_LICENSES = fs
  .readdirSync(LICENSES_DIR)
  .filter((file) => file.endsWith('.hbs'))
  .map((file) => file.replace('.hbs', ''));

export const AVAILABLE_LOCALES = fs
  .readdirSync(TRANSLATIONS_DIR)
  .filter((file) => fs.statSync(path.join(TRANSLATIONS_DIR, file)).isDirectory());
