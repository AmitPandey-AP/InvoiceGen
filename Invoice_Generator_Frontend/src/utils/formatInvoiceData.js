export const formatInvoiceData = (invoiceData) => {
  const {
    title,
    company = {},
    invoiceDetails = {},
    account = {},
    billing = {},

    tax = 0,
    notes = "",
    items = [],
    logo = "",
  } = invoiceData || {};

  const currencySymbol = "₹";
  const subTotal = items?.reduce(
    (acc, item) => acc + item.quantity * item.amount,
    0
  );
  const taxAmount = subTotal * (tax / 100);
  const total = subTotal + taxAmount;
  return {
    title,
    companyName: company.name,
    companyAddress: company.address,
    companyPhone: company.phone,
    companyLogo: logo,
    invoiceNumber: invoiceDetails.number,
    invoiceDate: invoiceDetails.date,
    accountName: account.name,
    accountNumber: account.number,
    accountIfscCode: account.ifsccode,
    billingName: billing.name,
    billingAddress: billing.address,
    billingPhone: billing.phone,
    currencySymbol,
    tax,
    items,
    notes,
    subTotal,
    taxAmount,
    total,
  };
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

};
