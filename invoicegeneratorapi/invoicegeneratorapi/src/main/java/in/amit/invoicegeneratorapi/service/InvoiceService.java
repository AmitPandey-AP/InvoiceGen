package in.amit.invoicegeneratorapi.service;

import in.amit.invoicegeneratorapi.entity.Invoice;
import in.amit.invoicegeneratorapi.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public Invoice saveInvoice(Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    public List<Invoice> fetchInvoices(String clerkId) {
        System.out.println("HII Again ...");

        return invoiceRepository.findByClerkId(clerkId);
    }

    public void removeInvoice(String invoiceId,String clerkId){

        Invoice existingInvoice = invoiceRepository.findByClerkIdAndId(clerkId, invoiceId).orElseThrow(() -> new RuntimeException("Invoice not found: " + invoiceId));
        invoiceRepository.delete(existingInvoice);
    }
}
