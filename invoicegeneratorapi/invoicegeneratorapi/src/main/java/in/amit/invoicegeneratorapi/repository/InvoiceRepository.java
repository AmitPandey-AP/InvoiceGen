package in.amit.invoicegeneratorapi.repository;

import in.amit.invoicegeneratorapi.entity.Invoice;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends MongoRepository<Invoice,String> {

    List<Invoice> findByClerkId(String id);
    Optional<Invoice> findByClerkIdAndId(String clerkId, String id);
}
