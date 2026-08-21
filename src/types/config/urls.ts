// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground.com/legal
// mailto:support AT graphical-playground DOT com

import { Loose } from '../loose';

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
  'eula',
  'cdn'
] as const;

/**
 * @brief Type representing the mandatory URLs for the project.
 */
export type MandatoryUrls = (typeof mandatoryUrls)[number];

/**
 * @brief Configuration type for URLs in the projects.
 */
export type UrlsConfig = {
  [key in Loose<MandatoryUrls>]: string;
};
