package org.csd.core.repository;

import org.csd.core.domain.ParticipationMethod;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ParticipationMethod entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ParticipationMethodRepository extends JpaRepository<ParticipationMethod, Long> {}
