// Copyright 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import type * as Workspace from '../../models/workspace/workspace.js';

import {FilteredUISourceCodeListProvider} from './FilteredUISourceCodeListProvider.js';
import {SourcesView} from './SourcesView.js';

let openFileQuickOpenInstance: OpenFileQuickOpen;

export class OpenFileQuickOpen extends FilteredUISourceCodeListProvider {
  static instance(opts: {
    forceNew: boolean|null,
  } = {forceNew: null}): OpenFileQuickOpen {
    const {forceNew} = opts;
    if (!openFileQuickOpenInstance || forceNew) {
      openFileQuickOpenInstance = new OpenFileQuickOpen();
    }

    return openFileQuickOpenInstance;
  }

  attach(): void {
    this.setDefaultScores(SourcesView.defaultUISourceCodeScores());
    super.attach();
  }

  uiSourceCodeSelected(
      uiSourceCode: Workspace.UISourceCode.UISourceCode|null, lineNumber?: number, columnNumber?: number): void {
    Host.userMetrics.actionTaken(Host.UserMetrics.Action.SelectFileFromFilePicker);

    if (!uiSourceCode) {
      return;
    }
    if (typeof lineNumber === 'number') {
      Common.Revealer.reveal(uiSourceCode.uiLocation(lineNumber, columnNumber));
    } else {
      Common.Revealer.reveal(uiSourceCode);
    }
  }

  filterProject(project: Workspace.Workspace.Project): boolean {
    return !project.isServiceProject();
  }

  renderAsTwoRows(): boolean {
    return true;
  }
}
