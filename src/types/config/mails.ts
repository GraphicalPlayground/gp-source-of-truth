// Copyright (c) - Graphical Playground. All rights reserved.
// For more information, see https://graphical-playground/legal
// mailto:support AT graphical-playground DOT com

/**
 * @brief Configuration type for organization emails.
 */
export type OrganizationMailConfig = {
  name: string;
  email: string;
  purpose: string;
};

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
  organization: OrganizationMailConfig[];
  maintainers: MaintainersMailConfig[];
};
