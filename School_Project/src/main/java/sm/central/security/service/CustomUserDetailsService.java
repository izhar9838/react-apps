
package sm.central.security.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import sm.central.repository.UserRepository;
import sm.central.security.model.CustomUserDetails;
import sm.central.security.model.UserEntity;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByUsername(username);
        if (user!=null) {
        	return new CustomUserDetails(user);
		} else {
			throw new UsernameNotFoundException("user not found with "+username);
		}
           
        
    }
}
