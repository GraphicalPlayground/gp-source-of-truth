// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground.com/legal
// mailto:support AT graphical-playground DOT com

import { simplifyUrl } from './simplify-url';
import { toLowerCase, toUpperCase, toKebabCase, toSnakeCase, toPascalCase } from './string-cases';
import { eq, ne, and, or, not, isArray } from './booleans';
import Handlebars from 'handlebars';

/**
 * @brief An array of helper functions that can be used in Handlebars templates.
 */
export const helpers: Record<string, Handlebars.HelperDelegate> = {
  simplifyUrl,
  toLowerCase,
  toUpperCase,
  toKebabCase,
  toSnakeCase,
  toPascalCase,
  eq,
  ne,
  and,
  or,
  not,
  isArray
} as const;

/**
 * @brief Exports the helper functions for use in other modules.
 */
export { simplifyUrl, toLowerCase, toUpperCase, toKebabCase, toSnakeCase, toPascalCase, eq, ne, and, or, not, isArray };
