package in.amit.invoicegeneratorapi.repository;

import in.amit.invoicegeneratorapi.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User,String> {
    Optional<User>  findByClerkId(String clerkId);
    boolean existsByClerkId(String clerkId);

}
