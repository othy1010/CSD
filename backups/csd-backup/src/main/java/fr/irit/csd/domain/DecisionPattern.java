package fr.irit.csd.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DecisionPattern.
 */
@Entity
@Table(name = "decision_pattern")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DecisionPattern implements Serializable {

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

    @OneToMany(mappedBy = "decisionPattern")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "proposals", "decisionPattern" }, allowSetters = true)
    private Set<Collaboration> collaborations = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "parameters", "selectionCriteria" }, allowSetters = true)
    private ParticipationMethod participationMethod;

    @ManyToOne(optional = false)
    @NotNull
    private CodecisionMethod codecisionMethod;

    @ManyToOne
    private Intent intent;

    @ManyToOne
    private Solution solution;

    @ManyToOne
    private Application application;

    @ManyToOne
    private Knowuse knowuse;

    // Csd-needle-entity-add-field - Csd will add fields here

    public Long getId() {
        return this.id;
    }

    public DecisionPattern id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public DecisionPattern name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public DecisionPattern description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Collaboration> getCollaborations() {
        return this.collaborations;
    }

    public void setCollaborations(Set<Collaboration> collaborations) {
        if (this.collaborations != null) {
            this.collaborations.forEach(i -> i.setDecisionPattern(null));
        }
        if (collaborations != null) {
            collaborations.forEach(i -> i.setDecisionPattern(this));
        }
        this.collaborations = collaborations;
    }

    public DecisionPattern collaborations(Set<Collaboration> collaborations) {
        this.setCollaborations(collaborations);
        return this;
    }

    public DecisionPattern addCollaboration(Collaboration collaboration) {
        this.collaborations.add(collaboration);
        collaboration.setDecisionPattern(this);
        return this;
    }

    public DecisionPattern removeCollaboration(Collaboration collaboration) {
        this.collaborations.remove(collaboration);
        collaboration.setDecisionPattern(null);
        return this;
    }

    public ParticipationMethod getParticipationMethod() {
        return this.participationMethod;
    }

    public void setParticipationMethod(ParticipationMethod participationMethod) {
        this.participationMethod = participationMethod;
    }

    public DecisionPattern participationMethod(ParticipationMethod participationMethod) {
        this.setParticipationMethod(participationMethod);
        return this;
    }

    public CodecisionMethod getCodecisionMethod() {
        return this.codecisionMethod;
    }

    public void setCodecisionMethod(CodecisionMethod codecisionMethod) {
        this.codecisionMethod = codecisionMethod;
    }

    public DecisionPattern codecisionMethod(CodecisionMethod codecisionMethod) {
        this.setCodecisionMethod(codecisionMethod);
        return this;
    }

    public Intent getIntent() {
        return this.intent;
    }

    public void setIntent(Intent intent) {
        this.intent = intent;
    }

    public DecisionPattern intent(Intent intent) {
        this.setIntent(intent);
        return this;
    }

    public Solution getSolution() {
        return this.solution;
    }

    public void setSolution(Solution solution) {
        this.solution = solution;
    }

    public DecisionPattern solution(Solution solution) {
        this.setSolution(solution);
        return this;
    }

    public Application getApplication() {
        return this.application;
    }

    public void setApplication(Application application) {
        this.application = application;
    }

    public DecisionPattern application(Application application) {
        this.setApplication(application);
        return this;
    }

    public Knowuse getKnowuse() {
        return this.knowuse;
    }

    public void setKnowuse(Knowuse knowuse) {
        this.knowuse = knowuse;
    }

    public DecisionPattern knowuse(Knowuse knowuse) {
        this.setKnowuse(knowuse);
        return this;
    }

    // Csd-needle-entity-add-getters-setters - Csd will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DecisionPattern)) {
            return false;
        }
        return id != null && id.equals(((DecisionPattern) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DecisionPattern{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
