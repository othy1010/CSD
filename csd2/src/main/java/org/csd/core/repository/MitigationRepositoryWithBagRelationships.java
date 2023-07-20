package org.csd.core.repository;

import java.util.List;
import java.util.Optional;
import org.csd.core.domain.Mitigation;
import org.springframework.data.domain.Page;

public interface MitigationRepositoryWithBagRelationships {
    Optional<Mitigation> fetchBagRelationships(Optional<Mitigation> mitigation);

    List<Mitigation> fetchBagRelationships(List<Mitigation> mitigations);

    Page<Mitigation> fetchBagRelationships(Page<Mitigation> mitigations);
}
