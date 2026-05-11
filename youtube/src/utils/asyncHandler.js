// const asyncHandler = () => {}
// const asyncHandler = (fn) => () => {}
// const asyncHandler = (fn) => async() => {}

// Wrapper to handle async errors automatically

const asyncHandler = (fn) => (req, res, next) => {
  console.log("⚡ asyncHandler HIT");

  return Promise.resolve(fn(req, res, next)).catch((err) => {
    console.log("❌ ERROR CAUGHT:", err.message);
    next(err);
  });
};

export { asyncHandler };

// const asyncHandler = (requestHandler) => {
//     return (req,res,next) => {
//         Promise.resolve(requestHandler(req, res, next)).catch((err) => (err))
//     }
// }
