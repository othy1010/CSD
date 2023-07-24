package fr.irit.csd.repository;

import fr.irit.csd.domain.Knowuse;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Knowuse entity.
 */
@SuppressWarnings("unused")
@Repository
public interface KnowuseRepository extends JpaRepository<Knowuse, Long> {}
