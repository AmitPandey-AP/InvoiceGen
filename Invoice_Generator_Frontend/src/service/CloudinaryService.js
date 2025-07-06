import axios from "axios";

export const uploadInvoiceThumbnail = async (imageData) => {
  const formData = new FormData();
  formData.append("file", imageData);
  formData.append("upload_preset", "test_amit");
  formData.append("cloud_name", "drbm5o6pe");
  const response = await axios.post(
    "https://api.cloudinary.com/v1_1/drbm5o6pe/image/upload",
    formData
  );
  return response.data.secure_url;
};
