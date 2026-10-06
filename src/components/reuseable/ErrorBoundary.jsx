import React from "react";
import Button from "./Button";

/**
 * ErrorBoundary - Protects 360° Panoramic Viewers, WebGL Canvas & Modals
 * Prevents white screen crashes and renders an authentic spatial recovery interface.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ViewRoom Spatial Display Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[360px] h-full flex flex-col items-center justify-center p-8 bg-base-200/95 text-[var(--app-text-primary)] border border-base-content/10 rounded-2xl text-center shadow-xl select-none">
          <div className="relative w-14 h-14 rounded-full bg-base-content text-base-100 flex items-center justify-center mb-4 text-xs font-black shadow-md">
            <span>360°</span>
          </div>
          <h2 className="text-lg sm:text-xl font-heading font-extrabold uppercase tracking-wider mb-2">
            Spatial Experience Paused
          </h2>
          <p className="text-xs sm:text-sm text-[var(--app-text-secondary)] max-w-md mb-6 leading-relaxed">
            The 3D WebGL renderer or spatial viewer encountered a temporary display pause. You can smoothly re-initialize the experience below.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" onClick={this.handleReset} className="!text-xs !py-2.5 !px-5">
              Reload Viewer
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                window.location.href = "/";
              }}
              className="!text-xs !py-2.5 !px-5"
            >
              Back to Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
