package fr.irit.csd.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import fr.irit.csd.domain.enumeration.ParticipationType;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ParticipationMethod.
 */
@Entity
@Table(name = "participation_method")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ParticipationMethod implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private ParticipationType type;

    @OneToMany(mappedBy = "participationMethod")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "participationMethod" }, allowSetters = true)
    private Set<Parameter> parameters = new HashSet<>();

    @OneToMany(mappedBy = "participationMethod")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "participationMethod" }, allowSetters = true)
    private Set<SelectionCriteria> selectionCriteria = new HashSet<>();

    // Csd-needle-entity-add-field - Csd will add fields here

    public Long getId() {
        return this.id;
    }

    public ParticipationMethod id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ParticipationType getType() {
        return this.type;
    }

    public ParticipationMethod type(ParticipationType type) {
        this.setType(type);
        return this;
    }

    public void setType(ParticipationType type) {
        this.type = type;
    }

    public Set<Parameter> getParameters() {
        return this.parameters;
    }

    public void setParameters(Set<Parameter> parameters) {
        if (this.parameters != null) {
            this.parameters.forEach(i -> i.setParticipationMethod(null));
        }
        if (parameters != null) {
            parameters.forEach(i -> i.setParticipationMethod(this));
        }
        this.parameters = parameters;
    }

    public ParticipationMethod parameters(Set<Parameter> parameters) {
        this.setParameters(parameters);
        return this;
    }

    public ParticipationMethod addParameter(Parameter parameter) {
        this.parameters.add(parameter);
        parameter.setParticipationMethod(this);
        return this;
    }

    public ParticipationMethod removeParameter(Parameter parameter) {
        this.parameters.remove(parameter);
        parameter.setParticipationMethod(null);
        return this;
    }

    public Set<SelectionCriteria> getSelectionCriteria() {
        return this.selectionCriteria;
    }

    public void setSelectionCriteria(Set<SelectionCriteria> selectionCriteria) {
        if (this.selectionCriteria != null) {
            this.selectionCriteria.forEach(i -> i.setParticipationMethod(null));
        }
        if (selectionCriteria != null) {
            selectionCriteria.forEach(i -> i.setParticipationMethod(this));
        }
        this.selectionCriteria = selectionCriteria;
    }

    public ParticipationMethod selectionCriteria(Set<SelectionCriteria> selectionCriteria) {
        this.setSelectionCriteria(selectionCriteria);
        return this;
    }

    public ParticipationMethod addSelectionCriteria(SelectionCriteria selectionCriteria) {
        this.selectionCriteria.add(selectionCriteria);
        selectionCriteria.setParticipationMethod(this);
        return this;
    }

    public ParticipationMethod removeSelectionCriteria(SelectionCriteria selectionCriteria) {
        this.selectionCriteria.remove(selectionCriteria);
        selectionCriteria.setParticipationMethod(null);
        return this;
    }

    // Csd-needle-entity-add-getters-setters - Csd will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ParticipationMethod)) {
            return false;
        }
        return id != null && id.equals(((ParticipationMethod) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ParticipationMethod{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            "}";
    }
}
