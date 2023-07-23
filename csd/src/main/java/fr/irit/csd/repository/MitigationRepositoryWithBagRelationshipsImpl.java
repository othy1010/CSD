package fr.irit.csd.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import fr.irit.csd.domain.Mitigation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class MitigationRepositoryWithBagRelationshipsImpl implements MitigationRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Mitigation> fetchBagRelationships(Optional<Mitigation> mitigation) {
        return mitigation.map(this::fetchVulnerabilities);
    }

    @Override
    public Page<Mitigation> fetchBagRelationships(Page<Mitigation> mitigations) {
        return new PageImpl<>(fetchBagRelationships(mitigations.getContent()), mitigations.getPageable(), mitigations.getTotalElements());
    }

    @Override
    public List<Mitigation> fetchBagRelationships(List<Mitigation> mitigations) {
        return Optional.of(mitigations).map(this::fetchVulnerabilities).orElse(Collections.emptyList());
    }

    Mitigation fetchVulnerabilities(Mitigation result) {
        return entityManager
            .createQuery(
                "select mitigation from Mitigation mitigation left join fetch mitigation.vulnerabilities where mitigation is :mitigation",
                Mitigation.class
            )
            .setParameter("mitigation", result)
            // .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Mitigation> fetchVulnerabilities(List<Mitigation> mitigations) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, mitigations.size()).forEach(index -> order.put(mitigations.get(index).getId(), index));
        List<Mitigation> result = entityManager
            .createQuery(
                "select distinct mitigation from Mitigation mitigation left join fetch mitigation.vulnerabilities where mitigation in :mitigations",
                Mitigation.class
            )
            .setParameter("mitigations", mitigations)
            // .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
