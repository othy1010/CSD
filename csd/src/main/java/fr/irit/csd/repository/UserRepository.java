package fr.irit.csd.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import fr.irit.csd.domain.User;

public interface UserRepository extends JpaRepository<User, Integer> {

  Optional<User> findByEmail(String email);

}
