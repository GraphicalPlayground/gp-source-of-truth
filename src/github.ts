// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground.com/legal
// mailto:support AT graphical-playground DOT com

import fs from 'node:fs';
import path from 'node:path';
import { Octokit } from '@octokit/core';
import { createPullRequest } from 'octokit-plugin-create-pull-request';
import { parseRepository } from './sync';

const PULL_REQUEST_BRANCH = 'sync/source-of-truth';
const COMMIT_MESSAGE = 'chore: sync source of truth';

const SyncOctokit = Octokit.plugin(createPullRequest);

/**
 * @brief The identity to author sync commits/PRs as, instead of the token's own identity.
 */
export interface BotIdentity {
  name: string;
  email: string;
}

/**
 * @brief The outcome of a sync pull request attempt.
 */
export interface SyncResult {
  pullRequestUrl: string | null;
  syncedFilesCount: number;
  skippedFilesCount: number;
}

/**
 * @brief Diffs the generated output against what's currently on disk.
 * @returns The subset of files whose content actually changed (or is new), plus the count
 * of files left untouched.
 */
function diffOutputFiles(
  targetDir: string,
  outputFiles: Record<string, string>
): { changedFiles: Record<string, string>; skippedFilesCount: number } {
  const changedFiles: Record<string, string> = {};
  let skippedFilesCount = 0;

  for (const [relativePath, content] of Object.entries(outputFiles)) {
    const fullPath = path.join(targetDir, relativePath);
    const current = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, 'utf-8') : undefined;

    if (current === content) {
      skippedFilesCount++;
    } else {
      changedFiles[relativePath] = content;
    }
  }

  return { changedFiles, skippedFilesCount };
}

/**
 * @brief Creates or updates the pull request that syncs the generated files into the target
 * repository, doing nothing if there's nothing to sync.
 * @param targetDir - The root directory of the checked-out target repository, used to diff
 * the generated content against what's currently there. Must be read before it's overwritten
 * with the newly generated files.
 * @param targetRepository - The target repository, as "owner/repo".
 * @param targetBranch - The branch to open the pull request against.
 * @param outputFiles - The full set of generated output files.
 * @param githubToken - The token to authenticate against the target repository with.
 * @param botIdentity - The identity to author the sync commit as, if not the token's own.
 * @returns The pull request URL (or null if nothing was synced) and the changed/unchanged file counts.
 */
export async function syncPullRequest(
  targetDir: string,
  targetRepository: string,
  targetBranch: string,
  outputFiles: Record<string, string>,
  githubToken: string,
  botIdentity?: BotIdentity
): Promise<SyncResult> {
  const { changedFiles, skippedFilesCount } = diffOutputFiles(targetDir, outputFiles);

  if (Object.keys(changedFiles).length === 0) {
    return { pullRequestUrl: null, syncedFilesCount: 0, skippedFilesCount };
  }

  const { owner, repo } = parseRepository(targetRepository);
  const octokit = new SyncOctokit({ auth: githubToken });

  const body = ['This pull request was created automatically to sync the source of truth.', '', 'Changed files:']
    .concat(Object.keys(changedFiles).map((file) => `- \`${file}\``))
    .join('\n');

  const response = await octokit.createPullRequest({
    owner,
    repo,
    base: targetBranch,
    head: PULL_REQUEST_BRANCH,
    update: true,
    createWhenEmpty: false,
    title: COMMIT_MESSAGE,
    body,
    changes: [
      {
        files: changedFiles,
        commit: COMMIT_MESSAGE,
        author: botIdentity,
        committer: botIdentity
      }
    ]
  });

  return {
    pullRequestUrl: response?.data.html_url ?? null,
    syncedFilesCount: Object.keys(changedFiles).length,
    skippedFilesCount
  };
}
