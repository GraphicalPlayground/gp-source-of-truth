// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground.com/legal
// mailto:support AT graphical-playground DOT com

/**
 * @brief List of mandatory URLs for the project.
 */
export const mandatoryUrls = [
  'homepage',
  'documentation',
  'blog',
  'community',
  'support',
  'legal',
  'security',
  'terms',
  'privacy',
  'eula'
] as const;

/**
 * @brief Type representing the mandatory URLs for the project.
 */
export type MandatoryUrls = (typeof mandatoryUrls)[number];

/**
 * @brief Configuration type for URLs in the projects.
 */
export type UrlsConfig = {
  [key in MandatoryUrls]: string;
};
