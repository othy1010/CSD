package fr.irit.csd.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import fr.irit.csd.domain.Threat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class ThreatRepositoryWithBagRelationshipsImpl implements ThreatRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Threat> fetchBagRelationships(Optional<Threat> threat) {
        return threat.map(this::fetchVulnerabilities);
    }

    @Override
    public Page<Threat> fetchBagRelationships(Page<Threat> threats) {
        return new PageImpl<>(fetchBagRelationships(threats.getContent()), threats.getPageable(), threats.getTotalElements());
    }

    @Override
    public List<Threat> fetchBagRelationships(List<Threat> threats) {
        return Optional.of(threats).map(this::fetchVulnerabilities).orElse(Collections.emptyList());
    }

    Threat fetchVulnerabilities(Threat result) {
        return entityManager
            .createQuery("select threat from Threat threat left join fetch threat.vulnerabilities where threat is :threat", Threat.class)
            .setParameter("threat", result)
            // .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Threat> fetchVulnerabilities(List<Threat> threats) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, threats.size()).forEach(index -> order.put(threats.get(index).getId(), index));
        List<Threat> result = entityManager
            .createQuery(
                "select distinct threat from Threat threat left join fetch threat.vulnerabilities where threat in :threats",
                Threat.class
            )
            .setParameter("threats", threats)
            // .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
