package sm.central.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import sm.central.security.JwtUtil;
import sm.central.security.model.CustomUserDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


public class RoleFilter extends OncePerRequestFilter {
    
	private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    // Constructor injection instead of @Autowired
    public RoleFilter(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        if (request.getRequestURI().equals("/login") && request.getMethod().equals("POST")) {
            String username = request.getParameter("username");
            String password = request.getParameter("password");
            String role = request.getParameter("role");

            if (username == null || password == null || role == null) {
                sendError(response, "All fields (username, password, role) are required", HttpStatus.BAD_REQUEST);
                return;
            }

            try {
                Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
                );
                
                CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
                
                if (!userDetails.getRole().equalsIgnoreCase(role)) {
                    sendError(response, "You don't have this role", HttpStatus.UNAUTHORIZED);
                    return;
                }

                String token = jwtUtil.generateToken(userDetails, role);
                sendSuccessResponse(response, token);
                return;
            } catch (AuthenticationException e) {
                sendError(response, "Invalid username or password", HttpStatus.UNAUTHORIZED);
                return;
            }
        }
        filterChain.doFilter(request, response);
    }

    private void sendSuccessResponse(HttpServletResponse response, String token) throws IOException {
        response.setStatus(HttpStatus.OK.value());
        response.setContentType("application/json");
        response.getWriter().write(
            String.format("{\"message\": \"Login successful\", \"token\": \"%s\"}", token)
        );
    }

    private void sendError(HttpServletResponse response, String message, HttpStatus status) 
            throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"" + message + "\"}");
    }
}
