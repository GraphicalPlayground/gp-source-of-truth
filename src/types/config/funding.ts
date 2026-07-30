// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground/legal
// mailto:support AT graphical-playground DOT com

/**
 * @brief Funding platforms supported by Github.
 */
export const fundingPlatforms = [
  'community_bridge',
  'github',
  'issuehunt',
  'ko_fi',
  'liberapay',
  'open_collective',
  'patreon',
  'tidelift',
  'polar',
  'buy_me_a_coffee',
  'thanks_dev'
] as const;

/**
 * @brief Type representing the supported funding platforms.
 */
export type FundingPlatform = (typeof fundingPlatforms)[number];

/**
 * @brief Type representing a ThanksDev handle in the format `u/gh/{string}`.
 */
export type ThanksDevHandle = `u/gh/${string}`;

/**
 * @brief Platform accepting multiple values (string or array of strings).
 * @note The maximum number of values is enforced in the JSON Schema (max 4).
 */
export type MultiValuePlatform = 'github' | 'custom';

/**
 * @brief Configuration type for funding platforms.
 */
export type FundingConfig = {
  // Platforms accepting string or array (max 4 enforced in JSON Schema)
  github?: string | string[];
  custom?: string | string[];

  // Pattern enforced handle
  thanks_dev?: ThanksDevHandle;
} & {
  // All remaining standard platforms accept single strings only
  [key in Exclude<FundingPlatform, 'github' | 'thanks_dev'>]?: string;
};
