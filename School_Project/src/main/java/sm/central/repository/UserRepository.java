package sm.central.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import sm.central.security.model.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
		UserEntity findByUsername(String username);
}
