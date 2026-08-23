// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground.com/legal
// mailto:support AT graphical-playground DOT com

import fs from 'node:fs';
import path from 'node:path';
import Handlebars from 'handlebars';
import { AVAILABLE_LOCALES, LICENSES_DIR } from './constants';
import { buildAlternatives, loadLocalesMetadata } from './i18n';
import { getLocalizedTemplatePath, LOCALIZED_TEMPLATE_NAMES, STATIC_TEMPLATES } from './templates';
import { getUserContent, setUserContent } from './user-content';
import type { Config, SourceOfTruthParameters } from './types';

/**
 * @brief Resolves the effective locale settings for a target repository.
 * @param parameters - The target repository's source of truth parameters.
 * @returns The resolved list of locales and the locale placed at the repository root.
 */
export function resolveLocaleSettings(parameters: SourceOfTruthParameters): {
  locales: string[];
  defaultLocale: string;
} {
  const locales = parameters.locales ?? AVAILABLE_LOCALES;
  const defaultLocale = parameters.defaultLocale ?? 'en';

  if (!locales.includes(defaultLocale)) {
    throw new Error(
      `"defaultLocale" ("${defaultLocale}") must be included in the configured locales (${locales.join(', ')})`
    );
  }

  return { locales, defaultLocale };
}

/**
 * @brief Splits a "owner/repo" string into its parts.
 */
export function parseRepository(repository: string): { owner: string; repo: string } {
  const [owner, repo] = repository.split('/');

  if (!owner || !repo) {
    throw new Error(`Invalid repository "${repository}", expected "owner/repo"`);
  }

  return { owner, repo };
}

/**
 * @brief Builds an include/exclude predicate from glob patterns.
 * @details "include" takes precedence over "exclude" when both are set.
 */
function createTemplateFilter(parameters: SourceOfTruthParameters): (name: string) => boolean {
  const { include, exclude } = parameters;

  if (include && include.length > 0) {
    return (name) => include.some((pattern) => path.matchesGlob(name, pattern));
  }

  if (exclude && exclude.length > 0) {
    return (name) => !exclude.some((pattern) => path.matchesGlob(name, pattern));
  }

  return () => true;
}

/**
 * @brief Renders a template, preserving any hand-written custom content already present
 * at the given output path.
 */
function render(templatePath: string, outputPath: string, targetDir: string, context: object): string {
  const template = Handlebars.compile(fs.readFileSync(templatePath, 'utf-8'));
  const customContent = setUserContent(getUserContent(path.join(targetDir, outputPath)));

  return template({ ...context, customContent });
}

/**
 * @brief Builds every output file for a target repository, respecting include/exclude and
 * locale placement rules.
 * @param targetDir - The root directory of the checked-out target repository.
 * @param targetRepository - The target repository, as "owner/repo".
 * @param orgConfig - The organization-wide configuration (funding, mails, socials, urls).
 * @param parameters - The target repository's source of truth parameters.
 * @returns A map of output-relative path to rendered file content.
 */
export function buildOutputFiles(
  targetDir: string,
  targetRepository: string,
  orgConfig: Config,
  parameters: SourceOfTruthParameters
): Record<string, string> {
  const { locales, defaultLocale } = resolveLocaleSettings(parameters);
  const isEnabled = createTemplateFilter(parameters);
  const localesMetadata = loadLocalesMetadata();
  const context = {
    github: { repo: parseRepository(targetRepository) },
    config: parameters,
    ...orgConfig
  };

  const output: Record<string, string> = {};

  for (const template of STATIC_TEMPLATES) {
    if (isEnabled(template.name)) {
      output[template.name] = render(template.templatePath, template.name, targetDir, context);
    }
  }

  const licenseTemplatePath = path.join(LICENSES_DIR, `${parameters.license}.hbs`);
  output['LICENSE.md'] = render(licenseTemplatePath, 'LICENSE.md', targetDir, context);

  for (const name of LOCALIZED_TEMPLATE_NAMES) {
    if (!isEnabled(name)) {
      continue;
    }

    for (const locale of locales) {
      const templatePath = getLocalizedTemplatePath(locale, name);

      if (!fs.existsSync(templatePath)) {
        continue;
      }

      const outputPath = locale === defaultLocale ? name : path.join('translations', locale, name);
      const alternatives = buildAlternatives(locale, locales, defaultLocale, name, localesMetadata);

      output[outputPath] = render(templatePath, outputPath, targetDir, {
        ...context,
        i18n: { alternatives, localization: localesMetadata[locale].localization }
      });
    }
  }

  return output;
}
