package in.amit.invoicegeneratorapi.controller;


import in.amit.invoicegeneratorapi.entity.User;
import in.amit.invoicegeneratorapi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public User createOrUpdateUser(@RequestBody User user, Authentication authentication){
        try {
            if(!authentication.getName().equals(user.getClerkId())){
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,"User doesn't have permission to access this resource ");
            }
            return userService.saveOrUpdateUser(user);
        }
        catch (Exception e){
            throw new RuntimeException(e);
        }
    }
}
