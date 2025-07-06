import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

function LandingPage() {
  const features = [
    {
      title: "Quick & Easy",
      desc: "Generate invoices in seconds with our simple UI.",
    },
    {
      title: "Customizable",
      desc: "Add branding, tax, currency and more.",
    },
    {
      title: "Download as PDF",
      desc: "Easily export your invoice to share or print.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-light py-5 text-center">
        <div className="container">
          <h1 className="display-4 fw-bold">Invoice Generator</h1>
          <p className="lead mb-4">Create beautiful invoices instantly.</p>
          <a href="/generate" className="btn btn-primary btn-lg">
            Generate Invoice
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Features</h2>
          <div className="row">
            {features.map((f, index) => (
              <div className="col-md-4 mb-3" key={index}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{f.title}</h5>
                    <p className="card-text">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <p className="mb-0">© {new Date().getFullYear()} InvoiceGen. Built with ❤️ </p>
      </footer>
    </div>
  );
}

export default LandingPage;
