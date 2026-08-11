// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground.com/legal
// mailto:support AT graphical-playground DOT com

import Handlebars from 'handlebars';

/**
 * @brief Returns true if the two provided arguments are equal.
 * @param a - The first argument to compare.
 * @param b - The second argument to compare.
 * @returns True if the arguments are equal, false otherwise.
 */
export const eq: Handlebars.HelperDelegate = (a: unknown, b: unknown): boolean => a === b;

/**
 * @brief Returns true if the two provided arguments are not equal.
 * @param a - The first argument to compare.
 * @param b - The second argument to compare.
 * @returns True if the arguments are not equal, false otherwise.
 */
export const ne: Handlebars.HelperDelegate = (a: unknown, b: unknown): boolean => a !== b;

/**
 * @brief Returns true if all of the provided arguments are truthy.
 * @param args - The arguments to evaluate.
 * @returns True if all arguments are truthy, false otherwise.
 */
export const and: Handlebars.HelperDelegate = (...args: unknown[]): boolean => args.slice(0, -1).every(Boolean);

/**
 * @brief Returns true if any of the provided arguments are truthy.
 * @param args - The arguments to evaluate.
 * @returns True if any argument is truthy, false otherwise.
 */
export const or: Handlebars.HelperDelegate = (...args: unknown[]): boolean => args.slice(0, -1).some(Boolean);

/**
 * @brief Negates a boolean value.
 * @param value - The boolean value to negate.
 * @returns The negated boolean value.
 */
export const not: Handlebars.HelperDelegate = (value: unknown): boolean => !value;

/**
 * @brief Returns true if the provided value is an array.
 * @param value - The value to check.
 * @returns True if the value is an array, false otherwise.
 */
export const isArray: Handlebars.HelperDelegate = (value: unknown): boolean => Array.isArray(value);
