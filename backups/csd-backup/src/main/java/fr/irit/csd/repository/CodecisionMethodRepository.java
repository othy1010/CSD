package fr.irit.csd.repository;

import fr.irit.csd.domain.CodecisionMethod;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CodecisionMethod entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CodecisionMethodRepository extends JpaRepository<CodecisionMethod, Long> {}
