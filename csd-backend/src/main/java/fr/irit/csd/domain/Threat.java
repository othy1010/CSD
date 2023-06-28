package fr.irit.csd.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import fr.irit.csd.domain.enumeration.ThreatReference;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Threat.
 */
@Entity
@Table(name = "threat")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Threat implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "probability")
    private Integer probability;

    @Enumerated(EnumType.STRING)
    @Column(name = "reference")
    private ThreatReference reference;

    @Column(name = "ref_id")
    private String refId;

    @ManyToMany
    @JoinTable(
        name = "rel_threat__vulnerability",
        joinColumns = @JoinColumn(name = "threat_id"),
        inverseJoinColumns = @JoinColumn(name = "vulnerability_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "risks", "proposals", "mitigations", "threats" }, allowSetters = true)
    private Set<Vulnerability> vulnerabilities = new HashSet<>();

    // Csd-needle-entity-add-field - Csd will add fields here

    public Long getId() {
        return this.id;
    }

    public Threat id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Threat name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Threat description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getProbability() {
        return this.probability;
    }

    public Threat probability(Integer probability) {
        this.setProbability(probability);
        return this;
    }

    public void setProbability(Integer probability) {
        this.probability = probability;
    }

    public ThreatReference getReference() {
        return this.reference;
    }

    public Threat reference(ThreatReference reference) {
        this.setReference(reference);
        return this;
    }

    public void setReference(ThreatReference reference) {
        this.reference = reference;
    }

    public String getRefId() {
        return this.refId;
    }

    public Threat refId(String refId) {
        this.setRefId(refId);
        return this;
    }

    public void setRefId(String refId) {
        this.refId = refId;
    }

    public Set<Vulnerability> getVulnerabilities() {
        return this.vulnerabilities;
    }

    public void setVulnerabilities(Set<Vulnerability> vulnerabilities) {
        this.vulnerabilities = vulnerabilities;
    }

    public Threat vulnerabilities(Set<Vulnerability> vulnerabilities) {
        this.setVulnerabilities(vulnerabilities);
        return this;
    }

    public Threat addVulnerability(Vulnerability vulnerability) {
        this.vulnerabilities.add(vulnerability);
        vulnerability.getThreats().add(this);
        return this;
    }

    public Threat removeVulnerability(Vulnerability vulnerability) {
        this.vulnerabilities.remove(vulnerability);
        vulnerability.getThreats().remove(this);
        return this;
    }

    // Csd-needle-entity-add-getters-setters - Csd will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Threat)) {
            return false;
        }
        return id != null && id.equals(((Threat) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Threat{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", probability=" + getProbability() +
            ", reference='" + getReference() + "'" +
            ", refId='" + getRefId() + "'" +
            "}";
    }
}
