package in.amit.invoicegeneratorapi.entity;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Document(collection = "invoices")
public class Invoice {

    @Id
    private String id;
    private String clerkId;

    private String title;

    private Billing billing;
    private InvoiceDetails invoiceDetails;
    private Account account;
    private Company company;

    private Double tax;
    private String notes;
    private String logo;

    private String thumbnailUrl;

    private List<Item> items;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant lastUpdatedAt;

    @Data
    public static class Billing {
        private String name;
        private String phone;
        private String address;
    }

    @Data
    public static class InvoiceDetails {
        private String number;
        private String date;
    }

    @Data
    public static class Account {
        private String name;
        private String number;
        private String ifsccode;
    }

    @Data
    public static class Company {
        private String name;
        private String phone;
        private String address;
    }

    @Data
    public static class Item {
        private String name;
        private String quantity;
        private String amount;
        private String description;
        private Double total;
    }
}
