// Copyright 2019 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
// eslint-disable-next-line @typescript-eslint/naming-convention
function WidgetfocusWidgetForNode(node: Node|null): void {
  while (node) {
    if (node.__widget) {
      break;
    }

    node = node.parentNodeOrShadowHost();
  }
  if (!node) {
    return;
  }

  let widget = node.__widget;
  while (widget && widget.parentWidget()) {
    const parentWidget = widget.parentWidget();
    if (!parentWidget) {
      break;
    }

    parentWidget.defaultFocusedChild = widget;
    widget = parentWidget;
  }
}

// TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
// eslint-disable-next-line @typescript-eslint/naming-convention
function XWidgetfocusWidgetForNode(node: Node|null): void {
  node = node && node.parentNodeOrShadowHost();
  const XWidgetCtor = customElements.get('x-widget');
  let widget = null;
  while (node) {
    if (node instanceof XWidgetCtor) {
      if (widget) {
        // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (node as any).defaultFocusedElement = widget;
      }
      widget = node;
    }
    node = node.parentNodeOrShadowHost();
  }
}

export function focusChanged(event: Event): void {
  const target = event.target as HTMLElement;
  const document = target ? target.ownerDocument : null;
  const element = document ? document.deepActiveElement() : null;
  WidgetfocusWidgetForNode(element);
  XWidgetfocusWidgetForNode(element);
}
