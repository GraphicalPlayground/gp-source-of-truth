// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground.com/legal
// mailto:support AT graphical-playground DOT com

import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { AVAILABLE_LICENSES, AVAILABLE_LOCALES } from './constants';
import type { SourceOfTruthParameters } from './types';

const DEFAULT_CONFIGURATION_FILE = path.join('.github', 'source-of-truth.yml');
const KNOWN_KEYS = ['license', 'locales', 'defaultLocale', 'exclude', 'include'];

/**
 * @brief Loads and validates the source of truth parameters for a repository.
 * @param targetDir - The root directory of the repository being synced.
 * @param configurationFile - Path to the configuration file, relative to targetDir.
 * @returns The parsed and validated parameters.
 */
export function loadParameters(
  targetDir: string,
  configurationFile: string = DEFAULT_CONFIGURATION_FILE
): SourceOfTruthParameters {
  const parametersPath = path.join(targetDir, configurationFile);

  if (!fs.existsSync(parametersPath)) {
    throw new Error(`Missing parameters file: ${parametersPath}`);
  }

  const raw = YAML.parse(fs.readFileSync(parametersPath, 'utf-8'));

  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new Error(`Invalid parameters file: ${parametersPath} must contain a YAML mapping`);
  }

  const data = raw as Record<string, unknown>;
  const unknownKeys = Object.keys(data).filter((key) => !KNOWN_KEYS.includes(key));

  if (unknownKeys.length > 0) {
    throw new Error(`Unknown parameter(s) in ${parametersPath}: ${unknownKeys.join(', ')}`);
  }

  const license = validateLicense(data.license, parametersPath);
  const locales = validateStringArray(data.locales, 'locales', parametersPath);
  const defaultLocale = validateDefaultLocale(data.defaultLocale, locales, parametersPath);
  const exclude = validateStringArray(data.exclude, 'exclude', parametersPath);
  const include = validateStringArray(data.include, 'include', parametersPath);

  if (locales) {
    for (const locale of locales) {
      if (!AVAILABLE_LOCALES.includes(locale)) {
        throw new Error(
          `Unknown locale "${locale}" in ${parametersPath}. Available locales: ${AVAILABLE_LOCALES.join(', ')}`
        );
      }
    }
  }

  return {
    license,
    ...(locales !== undefined ? { locales } : {}),
    ...(defaultLocale !== undefined ? { defaultLocale } : {}),
    ...(exclude !== undefined ? { exclude } : {}),
    ...(include !== undefined ? { include } : {})
  };
}

/**
 * @brief Validates the "license" field against the available license templates.
 */
function validateLicense(value: unknown, parametersPath: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Missing or invalid "license" in ${parametersPath}`);
  }

  if (!AVAILABLE_LICENSES.includes(value)) {
    throw new Error(
      `Unknown license "${value}" in ${parametersPath}. Available licenses: ${AVAILABLE_LICENSES.join(', ')}`
    );
  }

  return value;
}

/**
 * @brief Validates the "defaultLocale" field, ensuring consistency with "locales" when provided.
 */
function validateDefaultLocale(
  value: unknown,
  locales: string[] | undefined,
  parametersPath: string
): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Invalid "defaultLocale" in ${parametersPath}`);
  }

  if (!AVAILABLE_LOCALES.includes(value)) {
    throw new Error(
      `Unknown default locale "${value}" in ${parametersPath}. Available locales: ${AVAILABLE_LOCALES.join(', ')}`
    );
  }

  if (locales !== undefined && !locales.includes(value)) {
    throw new Error(`"defaultLocale" ("${value}") must be included in "locales" in ${parametersPath}`);
  }

  return value;
}

/**
 * @brief Validates that a field, if present, is a list of non-empty strings.
 */
function validateStringArray(value: unknown, field: string, parametersPath: string): string[] | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || item.length === 0)) {
    throw new Error(`Invalid "${field}" in ${parametersPath}: expected a list of non-empty strings`);
  }

  return value as string[];
}
