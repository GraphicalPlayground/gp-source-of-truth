// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground.com/legal
// mailto:support AT graphical-playground DOT com

import Handlebars from 'handlebars';

/**
 * @brief Simplifies a URL by removing the protocol (http:// or https://) and the "www." prefix.
 * @param url The URL to simplify.
 * @returns The simplified URL as a string. If the input is not a valid string, returns an empty string.
 */
export const simplifyUrl: Handlebars.HelperDelegate = (url: unknown): string => {
  if (typeof url !== 'string' || !url) {
    return '';
  }
  return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '');
};
