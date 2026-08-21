// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground.com/legal
// mailto:support AT graphical-playground DOT com

import fs from 'node:fs';
import { LOCALES_METADATA_PATH } from './constants';

/**
 * @brief Display metadata for a single locale, used to build the language switcher.
 */
export interface LocaleMetadata {
  /**
   * @brief The native display name, used as the link text for this locale in every row.
   */
  name: string;

  /**
   * @brief The fully-punctuated leading phrase for this locale's own row (emoji included).
   */
  label: string;

  /**
   * @brief Add custom localized strings for this locale, e.g. "Direct donation" in the target language.
   */
  localization: Record<string, string>;
}

/**
 * @brief Loads the display metadata for every documented locale.
 * @returns A map of locale code to its display metadata.
 */
export function loadLocalesMetadata(): Record<string, LocaleMetadata> {
  return JSON.parse(fs.readFileSync(LOCALES_METADATA_PATH, 'utf-8'));
}

/**
 * @brief Builds the "i18n.alternatives" language switcher line for a single rendered file.
 * @param currentLocale - The locale of the file being rendered.
 * @param locales - The locales configured for the target repository.
 * @param defaultLocale - The locale placed at the repository root.
 * @param filename - The output filename shared across every locale (e.g. "README.md").
 * @param metadata - The display metadata for every documented locale.
 * @returns A single line, e.g. "🌎 Read this in: [English](README.md) | ...".
 */
export function buildAlternatives(
  currentLocale: string,
  locales: string[],
  defaultLocale: string,
  filename: string,
  metadata: Record<string, LocaleMetadata>
): string {
  const isCurrentDefault = currentLocale === defaultLocale;
  const sortedLocales = [...locales].sort((a, b) => a.localeCompare(b));

  const links = sortedLocales.map((locale) => {
    const link =
      locale === defaultLocale
        ? isCurrentDefault
          ? filename
          : `../../${filename}`
        : isCurrentDefault
          ? `translations/${locale}/${filename}`
          : `../${locale}/${filename}`;

    return `[${metadata[locale].name}](${link})`;
  });

  return `${metadata[currentLocale].label} ${links.join(' | ')}`;
}
