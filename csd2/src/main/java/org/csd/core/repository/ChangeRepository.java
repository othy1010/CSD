package org.csd.core.repository;

import org.csd.core.domain.Change;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Change entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChangeRepository extends JpaRepository<Change, Long> {}
