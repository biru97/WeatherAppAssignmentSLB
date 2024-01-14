import React from "react";

interface ErrState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  { children?: React.ReactNode },
  ErrState
> {
  constructor(props: any) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <dialog id="my_err_modal_1" className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Oops, there is an error!</h3>
              <p>Caught in Errorboundary!</p>
            </div>
          </dialog>
        </div>
      );
    }

    // Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
