// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground/legal
// mailto:support AT graphical-playground DOT com

/**
 * @brief List of supported social platforms for the project.
 */
export const socialPlatforms = [
  'discord',
  'github',
  'linkedin',
  'twitter',
  'youtube',
  'twitch',
  'mastodon',
  'instagram',
  'facebook',
  'tiktok',
  'reddit',
  'snapchat',
  'telegram',
  'whatsapp',
  'medium',
  'devto'
] as const;

/**
 * @brief Type representing the supported social platforms.
 */
export type SocialPlatform = (typeof socialPlatforms)[number];

/**
 * @brief Configuration type for social media links.
 */
export type SocialsConfig = {
  [key in SocialPlatform]?: string;
};
