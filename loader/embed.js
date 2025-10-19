(function () {
  // Wait until DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    // Get user configuration
    const config = window.AgentWidgetConfig || {};

    const currentScript =
      document.currentScript ||
      document.querySelector('script[src*="agent-widget"]');

    let widgetBundleUrl;

    if (config.bundleUrl) {
      widgetBundleUrl = config.bundleUrl;
    } else if (currentScript && currentScript.src) {
      const scriptUrl = new URL(currentScript.src);
      const baseUrl =
        scriptUrl.origin +
        scriptUrl.pathname.substring(0, scriptUrl.pathname.lastIndexOf("/"));
      widgetBundleUrl = `${baseUrl}/widget/widget.bundle.umd.js`;
    } else {
      widgetBundleUrl = "./widget/widget.bundle.umd.js";
    }

    console.log("🚀 Loading widget from:", widgetBundleUrl);

    // Create container + Shadow DOM
    const host = document.createElement("div");
    host.id = "agent-widget-container";
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: "open" });

    // Create div where React will mount
    const appRoot = document.createElement("div");
    appRoot.id = "agent-widget-root";
    shadowRoot.appendChild(appRoot);

    // Load the widget bundle dynamically
    const script = document.createElement("script");
    script.src = widgetBundleUrl;
    script.type = "module";
    script.onload = () => {
      if (window.mountAgentWidget) {
        window.mountAgentWidget(config, appRoot);
      } else {
        console.error("mountAgentWidget not found");
      }
    };
    script.onerror = () => {
      console.error("Failed to load:", widgetBundleUrl);
    };
    shadowRoot.appendChild(script);

    // Inject base CSS
    const style = document.createElement("style");
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
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    shadowRoot.appendChild(style);
  }
})();
