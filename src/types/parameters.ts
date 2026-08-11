// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground.com/legal
// mailto:support AT graphical-playground DOT com

/**
 * @brief Parameters for the source of truth generation.
 * @details parsed from the .github/source-of-truth.yml file.
 */
export interface SourceOfTruthParameters {
  /**
   * @brief The license to use for the current repository.
   */
  license: string;

  /**
   * @brief The locale to use for the current repository.
   * @default All available locales will be used if not specified.
   */
  locales?: string[];

  /**
   * @brief The default locale to use for the current repository.
   * @default en Default to English if not specified.
   */
  defaultLocale?: string;

  /**
   * @brief The list of templates to exclude from the source of truth generation.
   * @default None, all the templates will be included if not specified.
   * @details If both include and exclude are specified, include takes precedence.
   */
  exclude?: string[];

  /**
   * @brief The list of templates to include in the source of truth generation.
   * @default None, all the templates will be included if not specified.
   * @note If both include and exclude are specified, include takes precedence.
   */
  include?: string[];
}
