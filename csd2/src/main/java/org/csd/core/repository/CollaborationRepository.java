package org.csd.core.repository;

import org.csd.core.domain.Collaboration;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Collaboration entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CollaborationRepository extends JpaRepository<Collaboration, Long> {}
