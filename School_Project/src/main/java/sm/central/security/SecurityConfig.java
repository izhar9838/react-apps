package sm.central.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import sm.central.security.filter.JwtFilter;
import sm.central.security.filter.RoleFilter;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	@Autowired
	private UserDetailsService detailsService;
	@Autowired
	private JwtFilter jwtFilter;
	@Autowired
    private JwtUtil jwtUtil;

   @SuppressWarnings("removal")
   @Bean
   public SecurityFilterChain securityFilterChain(HttpSecurity http,AuthenticationManager authenticationManager) throws Exception {
	   RoleFilter roleFilter = new RoleFilter(authenticationManager, jwtUtil);
       http.cors(withDefaults())
               .csrf(cust -> cust.disable())

               .authorizeHttpRequests(req -> req.
                       requestMatchers("api/login").permitAll()
                       .requestMatchers("/api/student/*").hasRole("student")
                       .requestMatchers("/api/student/*").hasRole("teacher")
                       .requestMatchers("/api/student/*").hasRole("admin")
                       .anyRequest().authenticated()).
               sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
               .addFilterBefore(roleFilter, UsernamePasswordAuthenticationFilter.class)
               .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);;
	   
	   	
	   return http.build();
   }
   @Bean
   public AuthenticationProvider authenticationProvider() {
	   DaoAuthenticationProvider provider=new DaoAuthenticationProvider();
	   provider.setPasswordEncoder(NoOpPasswordEncoder.getInstance());
	   provider.setUserDetailsService(detailsService);
	   return provider;
   }
   @Bean 
   public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception{
	   return config.getAuthenticationManager();
   }
}