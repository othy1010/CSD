package org.csd.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.csd.core.domain.enumeration.ChangeType;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Change.
 */
@Entity
@Table(name = "change")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Change implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private ChangeType type;

    @Column(name = "ref_id")
    private String refId;

    @ManyToOne
    @JsonIgnoreProperties(value = { "changes", "user", "risks", "collaboration", "decisions", "vulnerabilities" }, allowSetters = true)
    private Proposal proposal;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Change id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ChangeType getType() {
        return this.type;
    }

    public Change type(ChangeType type) {
        this.setType(type);
        return this;
    }

    public void setType(ChangeType type) {
        this.type = type;
    }

    public String getRefId() {
        return this.refId;
    }

    public Change refId(String refId) {
        this.setRefId(refId);
        return this;
    }

    public void setRefId(String refId) {
        this.refId = refId;
    }

    public Proposal getProposal() {
        return this.proposal;
    }

    public void setProposal(Proposal proposal) {
        this.proposal = proposal;
    }

    public Change proposal(Proposal proposal) {
        this.setProposal(proposal);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Change)) {
            return false;
        }
        return id != null && id.equals(((Change) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Change{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", refId='" + getRefId() + "'" +
            "}";
    }
}
