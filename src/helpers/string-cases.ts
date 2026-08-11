// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground.com/legal
// mailto:support AT graphical-playground DOT com

import Handlebars from 'handlebars';

/**
 * @brief Converts a string to lower case.
 * @param input - The input string to convert.
 * @returns The lower case version of the input string.
 */
export const toLowerCase: Handlebars.HelperDelegate = (input: unknown): string => {
  if (typeof input !== 'string' || !input) {
    return '';
  }
  return input.toLowerCase();
};

/**
 * @brief Converts a string to upper case.
 * @param input - The input string to convert.
 * @returns The upper case version of the input string.
 */
export const toUpperCase: Handlebars.HelperDelegate = (input: unknown): string => {
  if (typeof input !== 'string' || !input) {
    return '';
  }
  return input.toUpperCase();
};

/**
 * @brief Converts a string to kebab case.
 * @param input - The input string to convert.
 * @returns The kebab case version of the input string.
 */
export const toKebabCase: Handlebars.HelperDelegate = (input: unknown): string => {
  if (typeof input !== 'string' || !input) {
    return '';
  }
  return input
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

/**
 * @brief Converts a string to snake case.
 * @param input - The input string to convert.
 * @returns The snake case version of the input string.
 */
export const toSnakeCase: Handlebars.HelperDelegate = (input: unknown): string => {
  if (typeof input !== 'string' || !input) {
    return '';
  }
  return input
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
};

/**
 * @brief Converts a string to camel case.
 * @param input - The input string to convert.
 * @returns The camel case version of the input string.
 */
export const toCamelCase: Handlebars.HelperDelegate = (input: unknown): string => {
  if (typeof input !== 'string' || !input) {
    return '';
  }
  return input
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^[A-Z]/, (match) => match.toLowerCase());
};

/**
 * @brief Converts a string to Pascal case.
 * @param input - The input string to convert.
 * @returns The Pascal case version of the input string.
 */
export const toPascalCase: Handlebars.HelperDelegate = (input: unknown): string => {
  if (typeof input !== 'string' || !input) {
    return '';
  }
  return input
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^[a-z]/, (match) => match.toUpperCase());
};
