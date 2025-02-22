package sm.central.security.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;


import sm.central.repository.UserRepository;
import sm.central.security.JwtUtil;
import sm.central.security.model.UserEntity;

@Service
public class UserService {

    @Autowired
    private JwtUtil jwtService;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    private UserRepository repo;


   

    
}