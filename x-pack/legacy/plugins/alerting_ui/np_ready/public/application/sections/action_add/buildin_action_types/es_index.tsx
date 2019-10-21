/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import React from 'react';
import { EuiFieldText, EuiFormRow } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { ActionTypeModel, Props, Action } from '../../../../types';

export function getActionType(): ActionTypeModel {
  return {
    id: '.index',
    iconClass: 'indexOpen',
    selectMessage: i18n.translate('xpack.watcher.models.indexAction.selectMessageText', {
      defaultMessage: 'Index data into Elasticsearch.',
    }),
    simulatePrompt: i18n.translate('xpack.watcher.models.indexAction.simulateButtonLabel', {
      defaultMessage: 'Index data',
    }),
    validate: (action: Action): any => {
      return { errors: {} };
    },
    actionFields: IndexActionFields,
  };
}

const IndexActionFields: React.FunctionComponent<Props> = ({ action, editActionConfig }) => {
  const { index }: Record<string, any> = action.config;
  return (
    <EuiFormRow
      fullWidth
      label={i18n.translate('xpack.alertingUI.sections.actionAdd.indexAction.indexTextFieldLabel', {
        defaultMessage: 'Index (optional)',
      })}
    >
      <EuiFieldText
        fullWidth
        name="index"
        data-test-subj="indexInput"
        value={index}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          editActionConfig('index', e.target.value);
        }}
        onBlur={() => {
          if (!index) {
            editActionConfig('index', '');
          }
        }}
      />
    </EuiFormRow>
  );
};