import React, { useContext, useEffect, useRef, useState } from "react";
import InvoicePreview from "../components/InvoicePreview";
import { AppContext } from "../context/AppContext";
import {
  deleteInvoice,
  saveInvoice,
  sendInvoice,
} from "../service/InvoiceService.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";

import { Loader2 } from "lucide-react";
import { uploadInvoiceThumbnail } from "../service/CloudinaryService";
import { generatePdfFromElement } from "../utils/pdfUtils.js";

import { useAuth, useUser } from "@clerk/clerk-react";

const PreviewPage = () => {
  const previewRef = useRef();
  const { invoiceData, baseUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [downloading, setDownLoading] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [emailing, setEmailing] = useState(false);
  const { getToken } = useAuth();
  const { user } = useUser();

  const handleSaveAndExit = async () => {
    // console.log(invoiceData);
    try {
      setLoading(true);
      // Todo : create thumbnail url

      const canvas = await html2canvas(previewRef.current, {
        // scale: 2,
        useCORS: true,
        backgroundColor: "#fff",
        scrollY: -window.scrollY,
      });
      const imageData = canvas.toDataURL("images/png");

      const thumbnailUrl = await uploadInvoiceThumbnail(imageData);

      const payload = { ...invoiceData, thumbnailUrl, clerkId: user.id };

      const token = await getToken();
      const response = await saveInvoice(baseUrl, payload, token, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        toast.success("Invoice Saved Successfully");
        navigate("/dashboard");
      } else {
        toast.error("Something Went Wrong");
      }
    } catch (error) {
      throw new Error(error);
      toast.error("Failed to save invoice", error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    try {
      const token = await getToken();
      const response = await deleteInvoice(baseUrl, invoiceData.id, token);
      if (response.status === 204) {
        toast.success("Invoice Delete Successfully");
        navigate("/dashboard");
      } else {
        toast.error("Unable to Delete ");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Unable to Delete ", error.message);
    }
  };
  const handleDownloadPdf = async () => {
    if (!previewRef.current) {
      return;
    } else {
      try {
        setDownLoading(true);
        await generatePdfFromElement(
          previewRef.current,
          `invoice_${Date.now()}.pdf`
        );
      } catch (error) {
        toast.error("Failed to download PDF ", error.message);
      } finally {
        setDownLoading(false);
      }
    }
  };
  const handleSendEmail = async () => {
    if (!previewRef.current || !customerEmail) {
      return toast.error("Please Enter a valid email and try again. ");
    }
    try {
      setEmailing(true);
      const pdfBlob = await generatePdfFromElement(
        previewRef.current,
        `invoice_${Date.now()}`,
        true
      );
      const formdata = new FormData();
      formdata.append("file", pdfBlob, `invoice_${Date.now()}.pdf`);
      formdata.append("email", customerEmail);

      const token = await getToken();
      const response = await sendInvoice(baseUrl, formdata, token);
      if (response.status === 200) {
        toast.success("Email sent successfully");
        setShowModel(false);
        setCustomerEmail("");
        setEmailing(false);
      } else {
        toast.error("Failed to send email");
      }
    } catch (error) {
      toast.error("Failed to send email", error.message);
    } finally {
      setShowModel(false);
      setCustomerEmail("");
      setEmailing(false);
    }
  };

  useEffect(() => {
    if (!invoiceData || !invoiceData.items.length) {
      toast.error("Invoice data is empty ");
      navigate("/dashboard");
    }
  }, [invoiceData, navigate]);

  return (
    <div className="previewpage container-fluid d-flex flex-column p-3 min-vh-100">
      {/* action buttons  */}
      <div className="d-flex  flex-column align-items-center mb-4 gap-3">
        {/* list of template buttons  */}
        <div className="d-flex gap-2 flex-wrap justify-content-center"></div>

        {/* list of actions buttons  */}

        <div className="d-flex flex-wrap justify-content-center gap-2">
          <button
            onClick={handleSaveAndExit}
            disabled={loading}
            className="btn btn-primary d-flex align-items-center justify-content-cnter"
          >
            {loading && <Loader2 className="me-2 spin-animation" size={18} />}
            {loading ? "Saving..." : "Save And Exit"}
          </button>
          {invoiceData.id && (
            <button onClick={handleDelete} className="btn btn-danger">
              Delete Invoice
            </button>
          )}
          <button
            onClick={() => {
              navigate("/dashboard");
            }}
            className="btn btn-secondary"
          >
            Back To Dashboard
          </button>
          <button
            className="btn btn-info"
            onClick={() => {
              setShowModel(true);
            }}
          >
            Send Email
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="btn btn-success d-flex align-items-center justify-content-center"
          >
            {downloading && (
              <Loader2 className="me-2 spin-animation" size={18} />
            )}
            {downloading ? "Doenloading..." : "DownLoad PDF "}
          </button>
        </div>
      </div>
      {/* display the invoice preview */}
      <div className="flex-grow-1 overflow-auto d-flex justify-content-center align-items-start bg-light py-3">
        <div ref={previewRef} className="invoice-preview">
          {/* diplay  the pdf preview*/}
          <InvoicePreview invoiceData={invoiceData} />
        </div>
      </div>
      {showModel && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"> Send Invoice</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModel(false);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Customer Email"
                  value={customerEmail}
                  onChange={(e) => {
                    setCustomerEmail(e.target.value);
                  }}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSendEmail}
                  disabled={emailing}
                >
                  {emailing ? "Sending..." : "Send"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModel(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewPage;
