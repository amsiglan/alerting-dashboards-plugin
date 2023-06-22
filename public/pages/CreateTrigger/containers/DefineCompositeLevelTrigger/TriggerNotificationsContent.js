/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Fragment, useState, useEffect } from 'react';
import { EuiPanel, EuiFlexGroup, EuiFlexItem, EuiButtonEmpty, EuiSpacer } from '@elastic/eui';
import { FormikComboBox } from '../../../../components/FormControls';
import NotificationConfigDialog from './NotificationConfigDialog';
import _ from 'lodash';
import { FORMIK_INITIAL_ACTION_VALUES } from '../../utils/constants';
import { NOTIFY_OPTIONS_VALUES } from '../../components/Action/actions/Message';

const TriggerNotificationsContent = ({
  action,
  options,
  actionIndex,
  triggerValues,
  httpClient,
  notifications,
}) => {
  const [selected, setSelected] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    setSelected([
      {
        label: action.name,
        value: action.config_id,
        type: action.config_type,
        description: action.description,
      },
    ]);
  }, [action]);

  const onChange = (selectedOptions) => {
    setSelected(selectedOptions);

    const initialActionValues = _.cloneDeep(FORMIK_INITIAL_ACTION_VALUES);
    _.set(triggerValues, `triggerDefinitions[0].actions[${actionIndex}]`, {
      ...initialActionValues,
      destination_id: selectedOptions[0]?.value,
      name: selectedOptions[0]?.label,
      subject_template: {
        lang: 'mustache',
        source: 'Monitor {{ctx.monitor.name}} triggered an alert {{ctx.trigger.name}}',
      },
      action_execution_policy: {
        action_execution_scope: NOTIFY_OPTIONS_VALUES.PER_ALERT,
      },
    });
  };

  const showConfig = () => setIsModalVisible(true);

  return (
    <Fragment>
      <EuiPanel hasBorder={false} hasShadow={false}>
        <EuiFlexGroup>
          <EuiFlexItem
            grow={true}
            style={{
              maxWidth: '400px',
            }}
          >
            <FormikComboBox
              name={`channel_name_${actionIndex}`}
              formRow
              fieldProps={{
                isInvalid: !selected.length,
                errors: !selected.length && 'Required.',
              }}
              rowProps={{
                label: 'Notification channel',
              }}
              inputProps={{
                isInvalid: !selected.length,
                placeholder: 'Select a channel to get notified',
                options: options,
                selectedOptions: selected,
                onChange: (selectedOptions) => onChange(selectedOptions),
                singleSelection: { asPlainText: true },
              }}
            />
          </EuiFlexItem>
          <EuiFlexItem grow={false} style={{ paddingLeft: 0, marginLeft: 0 }}>
            <EuiButtonEmpty iconType={'popout'} style={{ marginTop: '22px' }}>
              Manage channels
            </EuiButtonEmpty>
          </EuiFlexItem>
        </EuiFlexGroup>
        {selected.length ? (
          <Fragment>
            <EuiSpacer size={'xs'} />
            <EuiButtonEmpty iconType={'pencil'} onClick={() => showConfig()}>
              Configure notification
            </EuiButtonEmpty>
          </Fragment>
        ) : null}
      </EuiPanel>
      {isModalVisible && (
        <NotificationConfigDialog
          closeModal={() => setIsModalVisible(false)}
          triggerValues={triggerValues}
          httpClient={httpClient}
          notifications={notifications}
          actionIndex={actionIndex}
        />
      )}
    </Fragment>
  );
};

export default TriggerNotificationsContent;