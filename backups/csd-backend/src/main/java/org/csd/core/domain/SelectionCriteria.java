package org.csd.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.csd.core.domain.enumeration.SelectionCriteriaType;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SelectionCriteria.
 */
@Entity
@Table(name = "selection_criteria")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SelectionCriteria implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "criterion")
    private SelectionCriteriaType criterion;

    @ManyToOne
    @JsonIgnoreProperties(value = { "parameters", "selectionCriteria" }, allowSetters = true)
    private ParticipationMethod participationMethod;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SelectionCriteria id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SelectionCriteriaType getCriterion() {
        return this.criterion;
    }

    public SelectionCriteria criterion(SelectionCriteriaType criterion) {
        this.setCriterion(criterion);
        return this;
    }

    public void setCriterion(SelectionCriteriaType criterion) {
        this.criterion = criterion;
    }

    public ParticipationMethod getParticipationMethod() {
        return this.participationMethod;
    }

    public void setParticipationMethod(ParticipationMethod participationMethod) {
        this.participationMethod = participationMethod;
    }

    public SelectionCriteria participationMethod(ParticipationMethod participationMethod) {
        this.setParticipationMethod(participationMethod);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SelectionCriteria)) {
            return false;
        }
        return id != null && id.equals(((SelectionCriteria) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SelectionCriteria{" +
            "id=" + getId() +
            ", criterion='" + getCriterion() + "'" +
            "}";
    }
}
