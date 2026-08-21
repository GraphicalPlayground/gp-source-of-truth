// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground.com/legal
// mailto:support AT graphical-playground DOT com

import fs from 'node:fs';
import path from 'node:path';
import type { Config } from './types';

/**
 * @brief Loads the configuration from the specified directory.
 * @param configDir - The directory containing the configuration files.
 * @returns The loaded configuration.
 */
export function loadConfig(configDir: string): Config {
  // Define paths to each configuration file
  const fundingConfigPath = path.join(configDir, 'funding.json');
  const mailsConfigPath = path.join(configDir, 'mails.json');
  const socialsConfigPath = path.join(configDir, 'socials.json');
  const urlsConfigPath = path.join(configDir, 'urls.json');
  const keymapConfigPath = path.join(configDir, 'keymap.json');

  // Read and parse each configuration file
  const fundingConfig: Config['funding'] = JSON.parse(fs.readFileSync(fundingConfigPath, 'utf-8'));
  const mailsConfig: Config['mails'] = JSON.parse(fs.readFileSync(mailsConfigPath, 'utf-8'));
  const socialsConfig: Config['socials'] = JSON.parse(fs.readFileSync(socialsConfigPath, 'utf-8'));
  const urlsConfig: Config['urls'] = JSON.parse(fs.readFileSync(urlsConfigPath, 'utf-8'));
  const keymapConfig: Config['keymap'] = JSON.parse(fs.readFileSync(keymapConfigPath, 'utf-8'));

  // Delete '$schema' property from each config object if it exists
  delete (fundingConfig as any).$schema;
  delete (mailsConfig as any).$schema;
  delete (socialsConfig as any).$schema;
  delete (urlsConfig as any).$schema;

  // Return the combined configuration object
  return {
    funding: fundingConfig,
    mails: mailsConfig,
    socials: socialsConfig,
    urls: urlsConfig,
    keymap: keymapConfig
  };
}
