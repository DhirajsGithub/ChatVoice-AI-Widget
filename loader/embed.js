(function () {
    // Wait until DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  
    function init() {
      // Get user configuration
      const config = window.AgentWidgetConfig || {};
    //   const widgetBundleUrl =
    //     config.bundleUrl || 'https://cdn.myagent.ai/widget.bundle.js';
    const widgetBundleUrl = "./dist/widget/widget.bundle.umd.js";
      // Create container + Shadow DOM
      const host = document.createElement('div');
      host.id = 'agent-widget-container';
      document.body.appendChild(host);
      const shadowRoot = host.attachShadow({ mode: 'open' });
  
      // Create div where React will mount
      const appRoot = document.createElement('div');
      appRoot.id = 'agent-widget-root';
      shadowRoot.appendChild(appRoot);
  
      // Load the widget bundle dynamically
      const script = document.createElement('script');
      script.src = widgetBundleUrl;
      script.type = 'module';
      script.onload = () => {
        // When bundle is ready, call the exported function
        if (window.mountAgentWidget) {
          window.mountAgentWidget(config, appRoot);
        } else {
          console.error('AgentWidget bundle failed to load.');
        }
      };
      script.onerror = () => {
        console.error('AgentWidget: Failed to load bundle script');
      };
      shadowRoot.appendChild(script);
  
      // Optional: inject minimal base CSS to isolate the widget
      const style = document.createElement('style');
      style.textContent = `
        :host {
          position: fixed !important;
          z-index: 9999 !important;
          display: block !important;
        }
        * {
          box-sizing: border-box;
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `;
      shadowRoot.appendChild(style);
    }
  })();
  