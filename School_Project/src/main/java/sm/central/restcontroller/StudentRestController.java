package sm.central.restcontroller;



import java.util.HashMap;
import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import sm.central.security.JwtUtil;
import sm.central.security.model.CustomUserDetails;
import sm.central.security.model.UserEntity;



@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173",allowCredentials = "true")
public class StudentRestController {

	@Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;
	
	@PostMapping(path = "/login",consumes = "application/json")
	public ResponseEntity<?> loginUser(@RequestBody UserEntity user){
		String username=user.getUsername();
		String password=user.getPassword();
		String role=user.getRole();
		System.out.println(username+"  "+password+"  "+role);
		try {
            // Validate input parameters
			System.out.println("inside try block");
            if (username == null || password == null || role == null || 
                username.trim().isEmpty() || password.trim().isEmpty() || role.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "All fields (username, password, role) are required");
                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
            }
            System.out.println("Authentication Start");
            // Authenticate username and password
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );
            System.out.println("cusotmuserdetails");

            // Get user details
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            System.out.println(userDetails);

            // Check if the requested role matches the user's role
            if (!userDetails.getRole().equalsIgnoreCase(role)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "You don't have this role");
                return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
            }
            System.out.println("generating token");
            // Generate JWT token if all checks pass
            String token = jwtUtil.generateToken(userDetails, role);
            System.out.println("token generated successfully;");
            // Prepare success response
            Map<String, Object> response = new HashMap<>();
            response.put("token",token);
            response.put("user", user);
            
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (BadCredentialsException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid username or password");
            return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "An error occurred during authentication");
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
		
	}
		
	
	

}
