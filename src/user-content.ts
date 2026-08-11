// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground.com/legal
// mailto:support AT graphical-playground DOT com

import fs from 'node:fs';

/**
 * @brief A pair of markers delimiting the user-editable section of a generated file.
 */
export interface UserContentDelimiters {
  start: string;
  end: string;
}

/**
 * @brief Default delimiters, suitable for Markdown/HTML based templates.
 */
export const DEFAULT_USER_CONTENT_DELIMITERS: UserContentDelimiters = {
  start: '<!-- gp-source-of-truth:custom:start -->',
  end: '<!-- gp-source-of-truth:custom:end -->'
};

/**
 * @brief Reads the current version of a generated file and extracts the
 * user-editable section so it can be carried over into the next render.
 * @param filePath - Path to the previously generated file (e.g. README.md).
 * @param delimiters - The markers surrounding the user-editable section.
 * @returns The extracted content, trimmed. If the file does not exist yet, an
 * empty string is returned. If the file exists but the delimiters cannot be
 * found, the whole file is returned so no existing content is ever lost.
 */
export function getUserContent(
  filePath: string,
  delimiters: UserContentDelimiters = DEFAULT_USER_CONTENT_DELIMITERS
): string {
  if (!fs.existsSync(filePath)) {
    return '';
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const startIndex = fileContent.indexOf(delimiters.start);
  const endIndex = fileContent.indexOf(delimiters.end);

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    return fileContent.trim();
  }

  return fileContent.slice(startIndex + delimiters.start.length, endIndex).trim();
}

/**
 * @brief Wraps user-editable content with the delimiters, ready to be passed
 * as a Handlebars parameter so the next generated file keeps the same markers.
 * @param content - The user-editable content to preserve.
 * @param delimiters - The markers surrounding the user-editable section.
 * @returns The delimited content.
 */
export function setUserContent(
  content: string,
  delimiters: UserContentDelimiters = DEFAULT_USER_CONTENT_DELIMITERS
): string {
  return `${delimiters.start}\n${content.trim()}\n${delimiters.end}`;
}
