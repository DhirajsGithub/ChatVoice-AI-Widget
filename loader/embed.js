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
      shadowRoot.appendChild(script);
  
      // Optional: inject minimal base CSS to isolate the widget
      const style = document.createElement('style');
      style.textContent = `
        :host {
          all: initial;
        }
        * {
          box-sizing: border-box;
        }
      `;
      shadowRoot.appendChild(style);
    }
  })();
  