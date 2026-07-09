export const successResponse = (
  res,
  data,
  message = "Success",
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const healthResponse = (res, data) => {
  return successResponse(res, data, "Service healthy");
};
