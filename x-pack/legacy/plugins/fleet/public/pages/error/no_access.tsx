/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { FormattedMessage, injectI18n } from '@kbn/i18n/react';
import * as React from 'react';
import { NoDataLayout } from '../../components/layouts/no_data';

export const NoAccessPage = injectI18n(({ intl }) => (
  <NoDataLayout
    title={intl.formatMessage({
      id: 'xpack.fleet.noAccess.accessDeniedTitle',
      defaultMessage: 'Access denied',
    })}
    actionSection={[]}
  >
    <p>
      <FormattedMessage
        id="xpack.fleet.noAccess.accessDeniedDescription"
        defaultMessage="You are not authorized to access Elastic Fleet. To use Elastic Fleet,
          you need a user role that contains read or all permissions for this application."
        values={{ elasticFleetRole: '`elastic_admin`' }}
      />
    </p>
  </NoDataLayout>
));