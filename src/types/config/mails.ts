// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground/legal
// mailto:support AT graphical-playground DOT com

/**
 * @brief List of organization mail types.
 */
export const organizationMailTypes = [
  "support",
  "contact",
  "security",
  "marketing",
  "legal",
  "sponsorship",
  "press"
] as const;

/**
 * @brief Type of organization mail types.
 */
export type OrganizationMailType = typeof organizationMailTypes[number];

/**
 * @brief Configuration type for maintainers emails.
 */
export type MaintainersMailConfig = {
  name: string;
  pseudo: string;
  emails: string[];
};

/**
 * @brief Configuration type for emails.
 */
export type MailsConfig = {
  organization: {
    [K in OrganizationMailType]: string;
  };
  maintainers: MaintainersMailConfig[];
};
