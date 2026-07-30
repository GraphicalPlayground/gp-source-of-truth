// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground/legal
// mailto:support AT graphical-playground DOT com

import fs from 'node:fs';
import Handlebars from 'handlebars';

Handlebars.registerHelper('simplifyUrl', function (url: unknown): string {
  if (typeof url !== 'string' || !url) {
    return '';
  }
  return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '');
});

const templateSource = fs.readFileSync('test.hbs', 'utf8');
const template = Handlebars.compile(templateSource);

// 2. Inject context (e.g. GitHub actions environment variables)
const rendered = template({
  github: {
    repository: process.env.GITHUB_REPOSITORY || 'my-org/my-repo',
    owner: process.env.GITHUB_REPOSITORY_OWNER || 'my-org'
  },
  overridden_content: 'This section is unique to this repository.'
});

// 3. Write final output
fs.writeFileSync('tests.md', rendered);

/*
import { context } from '@actions/github';
import { Octokit } from '@octokit/core';
import { createPullRequest } from 'octokit-plugin-create-pull-request';

const MyOctokit = Octokit.plugin(createPullRequest);
const octokit = new MyOctokit({ auth: process.env.GITHUB_TOKEN });

async function run() {
  const response = await octokit.createPullRequest({
    owner: context.repo.owner,
    repo: context.repo.repo,
    title: 'docs: update README & config',
    body: 'Automated PR created via plugin',
    head: 'feature/auto-sync',
    base: 'main',
    update: true, // Overwrites head branch if it already exists
    changes: [
      {
        files: {
          'README.md': '# New Content',
          'config.json': JSON.stringify({ status: 'ok' }, null, 2),
        },
        commit: 'docs: sync README and config files',
      },
    ],
  });

  if (response) {
    console.log(`PR created: #${response.data.number}`);
  }
}

run();

// context.repo.owner: Current repository owner/organization name.
// context.repo.repo: Current repository name.
// context.issue.number: PR or Issue number (if triggered by a PR/issue event).
// context.sha: Current commit SHA.
// context.ref: Git ref (e.g., refs/heads/main).
*/
