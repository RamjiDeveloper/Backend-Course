// Custom error class for consistent error handling

class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = "",
  ) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.data = null;

    // Capture proper stack trace
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
