import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-center">
          <h1 className="text-3xl font-bold text-red-600">
            Something went wrong
          </h1>
          <p className="text-gray-700 mt-4">
            Please refresh or try again later.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
