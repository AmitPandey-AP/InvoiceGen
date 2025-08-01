import axios from "axios";

export const saveInvoice = (baseUrl, payload, token) => {
  return axios.post(`${baseUrl}/invoices`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllInvoices = (baseUrl, token) => {
  return axios.get(`${baseUrl}/invoices`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteInvoice = (baseUrl, id, token) => {
  // console.log(baseUrl, "baseUrl");
  return axios.delete(`${baseUrl}/invoices/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const sendInvoice = (baseUrl, formData, token) => {
  return axios.post(`${baseUrl}/invoices/sendinvoice`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
