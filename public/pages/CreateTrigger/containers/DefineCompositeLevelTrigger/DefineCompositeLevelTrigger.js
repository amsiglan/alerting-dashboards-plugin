/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { EuiSpacer, EuiText, EuiTitle, EuiAccordion, EuiButton } from '@elastic/eui';
import { FormikFieldText, FormikSelect } from '../../../../components/FormControls';
import { hasError, isInvalid } from '../../../../utils/validate';
import { DEFAULT_TRIGGER_NAME, SEVERITY_OPTIONS } from '../../utils/constants';
import CompositeTriggerCondition from '../../components/CompositeTriggerCondition/CompositeTriggerCondition';
import TriggerNotifications from './TriggerNotifications';
import { FORMIK_COMPOSITE_INITIAL_TRIGGER_VALUES } from '../CreateTrigger/utils/constants';

const defaultRowProps = {
  label: 'Trigger name',
  style: { paddingLeft: '10px' },
  isInvalid,
  error: hasError,
};

const defaultInputProps = { isInvalid };

const selectFieldProps = {
  validate: () => {},
};

const selectRowProps = {
  label: 'Severity level',
  style: { paddingLeft: '10px', marginTop: '0px' },
  isInvalid,
  error: hasError,
};

const selectInputProps = {
  options: SEVERITY_OPTIONS,
};

const propTypes = {
  values: PropTypes.object.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

export const titleTemplate = (title, subTitle) => (
  <EuiText>
    <div style={{ fontWeight: 'bold' }}>{title}</div>
    {subTitle && (
      <EuiText color={'subdued'} size={'xs'}>
        {subTitle}
      </EuiText>
    )}
    <EuiSpacer size={'s'} />
  </EuiText>
);

class DefineCompositeLevelTrigger extends Component {
  render() {
    const {
      values,
      httpClient,
      notifications,
      notificationService,
      plugins,
      touched,
      edit,
      triggerIndex,
    } = this.props;

    const formikFieldPath = `triggerDefinitions[${triggerIndex}].`;
    const triggerName = _.get(values, `${formikFieldPath}name`, 'Trigger');
    const triggerDefinitions = _.get(values, 'triggerDefinitions', []);
    !triggerDefinitions.length &&
      _.set(values, 'triggerDefinitions', [
        {
          ...FORMIK_COMPOSITE_INITIAL_TRIGGER_VALUES,
          ...triggerDefinitions[triggerIndex],
          severity: 1,
          name: triggerName,
        },
      ]);
    const triggerActions = _.get(values, `${formikFieldPath}actions`, []);

    return (
      <EuiAccordion
        id={triggerName}
        buttonContent={
          <EuiTitle size={'s'} data-test-subj={`${formikFieldPath}_triggerAccordion`}>
            <h1>{_.isEmpty(triggerName) ? DEFAULT_TRIGGER_NAME : triggerName}</h1>
          </EuiTitle>
        }
        initialIsOpen={edit ? false : triggerIndex === 0}
        extraAction={
          <EuiButton
            color={'danger'}
            onClick={() => {
              triggerArrayHelpers.remove(triggerIndex);
            }}
            size={'s'}
          >
            Remove trigger
          </EuiButton>
        }
        style={{ paddingBottom: '15px', paddingTop: '10px' }}
      >
        <EuiSpacer size={'m'} />

        <FormikFieldText
          name={`${formikFieldPath}name`}
          fieldProps={{}}
          formRow
          rowProps={{
            ...defaultRowProps,
            style: {
              paddingLeft: 0,
            },
          }}
          inputProps={{
            ...defaultInputProps,
            value: triggerName,
            'data-test-subj': 'composite-trigger-name',
          }}
        />

        <EuiSpacer size={'l'} />

        <CompositeTriggerCondition
          triggerIndex={triggerIndex}
          edit={edit}
          formikFieldPath={formikFieldPath}
          formikFieldName={`triggerConditions`}
          label={titleTemplate(
            'Trigger condition',
            'An alert will trigger when the following monitors generate active alerts.'
          )}
          values={values}
          touched={touched}
          isDarkMode={this.props.isDarkMode}
          httpClient={httpClient}
        />

        <EuiSpacer size={'l'} />

        {titleTemplate('Alert severity')}
        <FormikSelect
          name={`${formikFieldPath}severity`}
          formRow
          fieldProps={selectFieldProps}
          rowProps={selectRowProps}
          inputProps={selectInputProps}
        />

        <EuiSpacer size={'xl'} />

        <TriggerNotifications
          formikFieldPath={formikFieldPath}
          triggerIndex={triggerIndex}
          httpClient={httpClient}
          plugins={plugins}
          notifications={notifications}
          notificationService={notificationService}
          triggerValues={values}
          triggerActions={triggerActions}
        />
      </EuiAccordion>
    );
  }
}

DefineCompositeLevelTrigger.propTypes = propTypes;

export default DefineCompositeLevelTrigger;
