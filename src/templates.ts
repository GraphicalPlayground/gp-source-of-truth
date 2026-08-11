// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground.com/legal
// mailto:support AT graphical-playground DOT com

import fs from 'node:fs';
import path from 'node:path';
import { AVAILABLE_LOCALES, TEMPLATES_DIR, TRANSLATIONS_DIR } from './constants';

const HBS_EXTENSION = '.hbs';
const IGNORED_TOP_LEVEL_DIRS = ['licenses', 'translations'];

/**
 * @brief A single template that produces exactly one output file.
 */
export interface TemplateEntry {
  /**
   * @brief The canonical output-relative name, used as the include/exclude identifier.
   */
  name: string;

  /**
   * @brief The absolute path to the template's ".hbs" source file.
   */
  templatePath: string;
}

/**
 * @brief The non-localized, non-license templates found under the templates directory.
 * @details Discovered by scanning the filesystem, so new templates are picked up
 * automatically without touching this file.
 */
export const STATIC_TEMPLATES: TemplateEntry[] = fs
  .readdirSync(TEMPLATES_DIR, { recursive: true, encoding: 'utf8' })
  .filter((entry) => entry.endsWith(HBS_EXTENSION))
  .filter((entry) => !IGNORED_TOP_LEVEL_DIRS.includes(entry.split(path.sep)[0]))
  .map((entry) => ({
    name: entry.slice(0, -HBS_EXTENSION.length),
    templatePath: path.join(TEMPLATES_DIR, entry)
  }));

/**
 * @brief The names of the templates that exist per-locale (e.g. "README.md").
 * @details Computed as the union of every ".hbs" file found across all locale
 * directories, so a template only present for some locales is still syncable.
 */
export const LOCALIZED_TEMPLATE_NAMES: string[] = Array.from(
  new Set(
    AVAILABLE_LOCALES.flatMap((locale) =>
      fs
        .readdirSync(path.join(TRANSLATIONS_DIR, locale))
        .filter((file) => file.endsWith(HBS_EXTENSION))
        .map((file) => file.slice(0, -HBS_EXTENSION.length))
    )
  )
);

/**
 * @brief Resolves the ".hbs" source path for a localized template in a given locale.
 * @param locale - The locale to resolve the template for.
 * @param name - The canonical template name (e.g. "README.md").
 * @returns The absolute path to the template's ".hbs" source file.
 */
export function getLocalizedTemplatePath(locale: string, name: string): string {
  return path.join(TRANSLATIONS_DIR, locale, `${name}${HBS_EXTENSION}`);
}
