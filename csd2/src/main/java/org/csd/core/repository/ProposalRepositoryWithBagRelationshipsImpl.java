package org.csd.core.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.csd.core.domain.Proposal;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class ProposalRepositoryWithBagRelationshipsImpl implements ProposalRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Proposal> fetchBagRelationships(Optional<Proposal> proposal) {
        return proposal.map(this::fetchRisks);
    }

    @Override
    public Page<Proposal> fetchBagRelationships(Page<Proposal> proposals) {
        return new PageImpl<>(fetchBagRelationships(proposals.getContent()), proposals.getPageable(), proposals.getTotalElements());
    }

    @Override
    public List<Proposal> fetchBagRelationships(List<Proposal> proposals) {
        return Optional.of(proposals).map(this::fetchRisks).orElse(Collections.emptyList());
    }

    Proposal fetchRisks(Proposal result) {
        return entityManager
            .createQuery(
                "select proposal from Proposal proposal left join fetch proposal.risks where proposal is :proposal",
                Proposal.class
            )
            .setParameter("proposal", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Proposal> fetchRisks(List<Proposal> proposals) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, proposals.size()).forEach(index -> order.put(proposals.get(index).getId(), index));
        List<Proposal> result = entityManager
            .createQuery(
                "select distinct proposal from Proposal proposal left join fetch proposal.risks where proposal in :proposals",
                Proposal.class
            )
            .setParameter("proposals", proposals)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
