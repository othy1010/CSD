package fr.irit.csd.repository;

import fr.irit.csd.domain.SelectionCriteria;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SelectionCriteria entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SelectionCriteriaRepository extends JpaRepository<SelectionCriteria, Long> {}
