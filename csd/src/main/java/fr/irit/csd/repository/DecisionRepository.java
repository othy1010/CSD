package fr.irit.csd.repository;

import fr.irit.csd.domain.Decision;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Decision entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DecisionRepository extends JpaRepository<Decision, Long> {}
