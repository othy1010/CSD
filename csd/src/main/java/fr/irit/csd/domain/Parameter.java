package fr.irit.csd.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import jakarta.persistence.*;
import fr.irit.csd.domain.enumeration.ParameterKind;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Parameter.
 */
@Entity
@Table(name = "parameter")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Parameter implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "kind")
    private ParameterKind kind;

    @ManyToOne
    @JsonIgnoreProperties(value = { "parameters", "selectionCriteria" }, allowSetters = true)
    private ParticipationMethod participationMethod;

    // Csd-needle-entity-add-field - Csd will add fields here

    public Long getId() {
        return this.id;
    }

    public Parameter id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ParameterKind getKind() {
        return this.kind;
    }

    public Parameter kind(ParameterKind kind) {
        this.setKind(kind);
        return this;
    }

    public void setKind(ParameterKind kind) {
        this.kind = kind;
    }

    public ParticipationMethod getParticipationMethod() {
        return this.participationMethod;
    }

    public void setParticipationMethod(ParticipationMethod participationMethod) {
        this.participationMethod = participationMethod;
    }

    public Parameter participationMethod(ParticipationMethod participationMethod) {
        this.setParticipationMethod(participationMethod);
        return this;
    }

    // Csd-needle-entity-add-getters-setters - Csd will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Parameter)) {
            return false;
        }
        return id != null && id.equals(((Parameter) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Parameter{" +
            "id=" + getId() +
            ", kind='" + getKind() + "'" +
            "}";
    }
}
