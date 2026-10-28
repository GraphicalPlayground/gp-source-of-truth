// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground.com/legal
// mailto:support AT graphical-playground DOT com

import Handlebars from 'handlebars';

export const github: Handlebars.HelperDelegate = (input: unknown): string => {
  return new Handlebars.SafeString('${{' + input + '}}');
};
