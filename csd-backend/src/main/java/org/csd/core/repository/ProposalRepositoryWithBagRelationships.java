package org.csd.core.repository;

import java.util.List;
import java.util.Optional;
import org.csd.core.domain.Proposal;
import org.springframework.data.domain.Page;

public interface ProposalRepositoryWithBagRelationships {
    Optional<Proposal> fetchBagRelationships(Optional<Proposal> proposal);

    List<Proposal> fetchBagRelationships(List<Proposal> proposals);

    Page<Proposal> fetchBagRelationships(Page<Proposal> proposals);
}
