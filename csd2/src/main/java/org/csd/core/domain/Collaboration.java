package org.csd.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.csd.core.domain.enumeration.CollaborationState;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Collaboration.
 */
@Entity
@Table(name = "collaboration")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Collaboration implements Serializable {

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

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "decision_duration")
    private Integer decisionDuration;

    @Column(name = "evaluation_duration")
    private Integer evaluationDuration;

    @Enumerated(EnumType.STRING)
    @Column(name = "collaboration_state")
    private CollaborationState collaborationState;

    @OneToMany(mappedBy = "collaboration")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "changes", "user", "risks", "collaboration", "decisions", "vulnerabilities" }, allowSetters = true)
    private Set<Proposal> proposals = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "collaborations", "participationMethod", "codecisionMethod", "intent", "solution", "application", "knowuse" },
        allowSetters = true
    )
    private DecisionPattern decisionPattern;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Collaboration id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Collaboration name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Collaboration description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getStartDate() {
        return this.startDate;
    }

    public Collaboration startDate(LocalDate startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public Integer getDecisionDuration() {
        return this.decisionDuration;
    }

    public Collaboration decisionDuration(Integer decisionDuration) {
        this.setDecisionDuration(decisionDuration);
        return this;
    }

    public void setDecisionDuration(Integer decisionDuration) {
        this.decisionDuration = decisionDuration;
    }

    public Integer getEvaluationDuration() {
        return this.evaluationDuration;
    }

    public Collaboration evaluationDuration(Integer evaluationDuration) {
        this.setEvaluationDuration(evaluationDuration);
        return this;
    }

    public void setEvaluationDuration(Integer evaluationDuration) {
        this.evaluationDuration = evaluationDuration;
    }

    public CollaborationState getCollaborationState() {
        return this.collaborationState;
    }

    public Collaboration collaborationState(CollaborationState collaborationState) {
        this.setCollaborationState(collaborationState);
        return this;
    }

    public void setCollaborationState(CollaborationState collaborationState) {
        this.collaborationState = collaborationState;
    }

    public Set<Proposal> getProposals() {
        return this.proposals;
    }

    public void setProposals(Set<Proposal> proposals) {
        if (this.proposals != null) {
            this.proposals.forEach(i -> i.setCollaboration(null));
        }
        if (proposals != null) {
            proposals.forEach(i -> i.setCollaboration(this));
        }
        this.proposals = proposals;
    }

    public Collaboration proposals(Set<Proposal> proposals) {
        this.setProposals(proposals);
        return this;
    }

    public Collaboration addProposal(Proposal proposal) {
        this.proposals.add(proposal);
        proposal.setCollaboration(this);
        return this;
    }

    public Collaboration removeProposal(Proposal proposal) {
        this.proposals.remove(proposal);
        proposal.setCollaboration(null);
        return this;
    }

    public DecisionPattern getDecisionPattern() {
        return this.decisionPattern;
    }

    public void setDecisionPattern(DecisionPattern decisionPattern) {
        this.decisionPattern = decisionPattern;
    }

    public Collaboration decisionPattern(DecisionPattern decisionPattern) {
        this.setDecisionPattern(decisionPattern);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Collaboration)) {
            return false;
        }
        return id != null && id.equals(((Collaboration) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Collaboration{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", decisionDuration=" + getDecisionDuration() +
            ", evaluationDuration=" + getEvaluationDuration() +
            ", collaborationState='" + getCollaborationState() + "'" +
            "}";
    }
}
