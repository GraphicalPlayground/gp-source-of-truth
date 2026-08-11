// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground.com/legal
// mailto:support AT graphical-playground DOT com

import type { FundingConfig } from './funding';
import type { MailsConfig } from './mails';
import type { SocialsConfig } from './socials';
import type { UrlsConfig } from './urls';

/**
 * @brief Represents the configuration for the application.
 * @property funding - The funding configuration.
 * @property mails - The mails configuration.
 * @property socials - The socials configuration.
 * @property urls - The URLs configuration.
 */
export interface Config {
  funding: FundingConfig;
  mails: MailsConfig;
  socials: SocialsConfig;
  urls: UrlsConfig;
}

export type { FundingConfig, MailsConfig, SocialsConfig, UrlsConfig };
