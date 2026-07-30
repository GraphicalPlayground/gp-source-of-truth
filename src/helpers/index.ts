// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground/legal
// mailto:support AT graphical-playground DOT com

import { simplifyUrl } from './simplify-url';
import Handlebars from 'handlebars';

/**
 * @brief An array of helper functions that can be used in Handlebars templates.
 */
export const helpers: Record<string, Handlebars.HelperDelegate> = {
  simplifyUrl
} as const;

/**
 * @brief Exports the helper functions for use in other modules.
 */
export { simplifyUrl };
