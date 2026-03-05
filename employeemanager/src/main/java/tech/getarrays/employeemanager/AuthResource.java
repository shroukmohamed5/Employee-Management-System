package tech.getarrays.employeemanager;

import tech.getarrays.employeemanager.model.Admin;
import tech.getarrays.employeemanager.repo.AdminRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthResource {

    private final AdminRepo adminRepo;

    public AuthResource(AdminRepo adminRepo) {
        this.adminRepo = adminRepo;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        Optional<Admin> admin = adminRepo.findByEmail(email);

        if (admin.isPresent() && admin.get().getPassword().equals(password)) {
            return ResponseEntity.ok(Map.of("message", "Login successful", "email", email));
        }

        return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
    }
}