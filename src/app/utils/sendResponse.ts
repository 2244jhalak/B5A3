export const sendResponse = (res: any, data: any, message: string, status = 200) => {

  res.status(status).json({ success: true, message, data });
  
};