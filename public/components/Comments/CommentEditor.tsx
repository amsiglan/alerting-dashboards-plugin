/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*/

import React from "react";
import { 
  EuiFlexGroup, 
  EuiFlexItem, 
  EuiButton 
} from "@elastic/eui";

export interface CommentEditorProps {
  isLoading: boolean;
  saveDisabled?: boolean;
  draftCommentContent: string;
  onSave: React.MouseEventHandler;
  onCancel?: React.MouseEventHandler;
  onContentChange: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export const CommentEditor: React.FC<CommentEditorProps> = ({ 
  isLoading, 
  draftCommentContent,
  saveDisabled,
  onSave, 
  onCancel,
  onContentChange, 
}) => (
  <EuiFlexGroup gutterSize="s" direction="column" >
    <EuiFlexItem>
      <textarea style={{ resize: 'vertical', fontSize: 14, minHeight: 45 }} value={draftCommentContent} onChange={onContentChange}/>
    </EuiFlexItem>
    <EuiFlexItem grow={false} style={{ alignSelf: 'flex-end' }}>
      <EuiFlexGroup gutterSize="s">
        {onCancel && (
          <EuiFlexItem grow={false}>
            <EuiButton onClick={onCancel}>
              Cancel
            </EuiButton>
          </EuiFlexItem>
        )}
        <EuiFlexItem grow={false}>
          <EuiButton onClick={onSave} color="primary" isLoading={isLoading} disabled={saveDisabled} fill>
            Save
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiFlexItem>
  </EuiFlexGroup>
)