// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground.com/legal
// mailto:support AT graphical-playground DOT com

import fs from 'node:fs';
import path from 'node:path';
import Handlebars from 'handlebars';
import { helpers } from './helpers';
import { loadConfig } from './config';
import { loadParameters } from './parameters';
import { buildOutputFiles } from './sync';
import { syncPullRequest, type BotIdentity } from './github';
import { CONFIG_DIR } from './constants';

// Registers all helper functions with Handlebars.
Object.keys(helpers).forEach((helper) => {
  Handlebars.registerHelper(helper, helpers[helper]);
});

/**
 * @brief Sets a GitHub Actions step output, if running inside a workflow.
 */
function setActionOutput(name: string, value: string | number): void {
  const outputFile = process.env.GITHUB_OUTPUT;

  if (outputFile) {
    fs.appendFileSync(outputFile, `${name}=${value}\n`);
  }
}

async function run(): Promise<void> {
  const targetDir = path.resolve(process.env.TARGET_DIR ?? 'target-repository');
  const targetRepository = process.env.TARGET_REPOSITORY;
  const targetBranch = process.env.TARGET_BRANCH ?? 'main';
  const configurationFile = process.env.CONFIGURATION_FILE;
  const githubToken = process.env.GITHUB_TOKEN;
  const botName = process.env.BOT_NAME;
  const botEmail = process.env.BOT_EMAIL;
  const botIdentity: BotIdentity | undefined = botName && botEmail ? { name: botName, email: botEmail } : undefined;

  if (!targetRepository) {
    throw new Error('Missing required environment variable: TARGET_REPOSITORY');
  }

  const orgConfig = loadConfig(CONFIG_DIR);
  const parameters = loadParameters(targetDir, configurationFile);
  const outputFiles = buildOutputFiles(targetDir, targetRepository, orgConfig, parameters);

  let result = { pullRequestUrl: null as string | null, syncedFilesCount: 0, skippedFilesCount: 0 };

  if (githubToken) {
    result = await syncPullRequest(targetDir, targetRepository, targetBranch, outputFiles, githubToken, botIdentity);
  } else {
    console.log('Skipping pull request creation: no GITHUB_TOKEN set.');
  }

  for (const [relativePath, content] of Object.entries(outputFiles)) {
    const fullPath = path.join(targetDir, relativePath);

    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
  }

  setActionOutput('pull-request-url', result.pullRequestUrl ?? '');
  setActionOutput('synced-files-count', result.syncedFilesCount);
  setActionOutput('skipped-files-count', result.skippedFilesCount);
}

run();
