package org.csd.core.repository;

import java.util.List;
import java.util.Optional;
import org.csd.core.domain.Threat;
import org.springframework.data.domain.Page;

public interface ThreatRepositoryWithBagRelationships {
    Optional<Threat> fetchBagRelationships(Optional<Threat> threat);

    List<Threat> fetchBagRelationships(List<Threat> threats);

    Page<Threat> fetchBagRelationships(Page<Threat> threats);
}
