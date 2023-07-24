package fr.irit.csd.repository;

import fr.irit.csd.domain.DecisionPattern;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the DecisionPattern entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DecisionPatternRepository extends JpaRepository<DecisionPattern, Long> {}
