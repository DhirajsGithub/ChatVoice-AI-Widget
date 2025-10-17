import React from 'react';
import ReactDOM from 'react-dom/client';
import { AgentWidget } from './AgentWidget';

export function mountAgentWidget(config: any, rootElement?: HTMLElement) {
  const rootEl = rootElement || document.createElement('div');
  if (!rootElement) {
    document.body.appendChild(rootEl);
  }

  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <AgentWidget config={config} />
    </React.StrictMode>
  );
}

;(window as any).mountAgentWidget = mountAgentWidget;
