package fr.irit.csd.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Mitigation.
 */
@Entity
@Table(name = "mitigation")
//@cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Mitigation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @ManyToMany
    @NotNull
    @JoinTable(
        name = "rel_mitigation__vulnerability",
        joinColumns = @JoinColumn(name = "mitigation_id"),
        inverseJoinColumns = @JoinColumn(name = "vulnerability_id")
    )
    //@cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "risks", "proposals", "mitigations", "threats" }, allowSetters = true)
    private Set<Vulnerability> vulnerabilities = new HashSet<>();

    // Csd-needle-entity-add-field - Csd will add fields here

    public Long getId() {
        return this.id;
    }

    public Mitigation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<Vulnerability> getVulnerabilities() {
        return this.vulnerabilities;
    }

    public void setVulnerabilities(Set<Vulnerability> vulnerabilities) {
        this.vulnerabilities = vulnerabilities;
    }

    public Mitigation vulnerabilities(Set<Vulnerability> vulnerabilities) {
        this.setVulnerabilities(vulnerabilities);
        return this;
    }

    public Mitigation addVulnerability(Vulnerability vulnerability) {
        this.vulnerabilities.add(vulnerability);
        vulnerability.getMitigations().add(this);
        return this;
    }

    public Mitigation removeVulnerability(Vulnerability vulnerability) {
        this.vulnerabilities.remove(vulnerability);
        vulnerability.getMitigations().remove(this);
        return this;
    }

    // Csd-needle-entity-add-getters-setters - Csd will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Mitigation)) {
            return false;
        }
        return id != null && id.equals(((Mitigation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Mitigation{" +
            "id=" + getId() +
            "}";
    }
}
