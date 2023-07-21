package fr.irit.csd.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import jakarta.persistence.*;
import fr.irit.csd.domain.enumeration.Severity;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Risk.
 */
@Entity
@Table(name = "risk")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Risk implements Serializable {

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
    @Column(name = "impact_severity")
    private Severity impactSeverity;

    @ManyToMany(mappedBy = "risks")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "changes", "user", "risks", "collaboration", "decisions", "vulnerabilities" }, allowSetters = true)
    private Set<Proposal> proposals = new HashSet<>();

    @ManyToMany(mappedBy = "risks")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "risks", "proposals", "mitigations", "threats" }, allowSetters = true)
    private Set<Vulnerability> vulnerabilities = new HashSet<>();

    // Csd-needle-entity-add-field - Csd will add fields here

    public Long getId() {
        return this.id;
    }

    public Risk id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Risk name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Risk description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getProbability() {
        return this.probability;
    }

    public Risk probability(Integer probability) {
        this.setProbability(probability);
        return this;
    }

    public void setProbability(Integer probability) {
        this.probability = probability;
    }

    public Severity getImpactSeverity() {
        return this.impactSeverity;
    }

    public Risk impactSeverity(Severity impactSeverity) {
        this.setImpactSeverity(impactSeverity);
        return this;
    }

    public void setImpactSeverity(Severity impactSeverity) {
        this.impactSeverity = impactSeverity;
    }

    public Set<Proposal> getProposals() {
        return this.proposals;
    }

    public void setProposals(Set<Proposal> proposals) {
        if (this.proposals != null) {
            this.proposals.forEach(i -> i.removeRisk(this));
        }
        if (proposals != null) {
            proposals.forEach(i -> i.addRisk(this));
        }
        this.proposals = proposals;
    }

    public Risk proposals(Set<Proposal> proposals) {
        this.setProposals(proposals);
        return this;
    }

    public Risk addProposal(Proposal proposal) {
        this.proposals.add(proposal);
        proposal.getRisks().add(this);
        return this;
    }

    public Risk removeProposal(Proposal proposal) {
        this.proposals.remove(proposal);
        proposal.getRisks().remove(this);
        return this;
    }

    public Set<Vulnerability> getVulnerabilities() {
        return this.vulnerabilities;
    }

    public void setVulnerabilities(Set<Vulnerability> vulnerabilities) {
        if (this.vulnerabilities != null) {
            this.vulnerabilities.forEach(i -> i.removeRisk(this));
        }
        if (vulnerabilities != null) {
            vulnerabilities.forEach(i -> i.addRisk(this));
        }
        this.vulnerabilities = vulnerabilities;
    }

    public Risk vulnerabilities(Set<Vulnerability> vulnerabilities) {
        this.setVulnerabilities(vulnerabilities);
        return this;
    }

    public Risk addVulnerability(Vulnerability vulnerability) {
        this.vulnerabilities.add(vulnerability);
        vulnerability.getRisks().add(this);
        return this;
    }

    public Risk removeVulnerability(Vulnerability vulnerability) {
        this.vulnerabilities.remove(vulnerability);
        vulnerability.getRisks().remove(this);
        return this;
    }

    // Csd-needle-entity-add-getters-setters - Csd will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Risk)) {
            return false;
        }
        return id != null && id.equals(((Risk) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Risk{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", probability=" + getProbability() +
            ", impactSeverity='" + getImpactSeverity() + "'" +
            "}";
    }
}
