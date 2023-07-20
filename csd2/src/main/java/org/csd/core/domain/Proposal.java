package org.csd.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.csd.core.domain.enumeration.ProposalState;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Proposal.
 */
@Entity
@Table(name = "proposal")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Proposal implements Serializable {

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

    @Column(name = "creation_date")
    private LocalDate creationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "proposal_state")
    private ProposalState proposalState;

    @OneToMany(mappedBy = "proposal")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "proposal" }, allowSetters = true)
    private Set<Change> changes = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "user", "decisions", "proposals" }, allowSetters = true)
    private InvolvedUser user;

    @ManyToMany
    @JoinTable(
        name = "rel_proposal__risk",
        joinColumns = @JoinColumn(name = "proposal_id"),
        inverseJoinColumns = @JoinColumn(name = "risk_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "proposals", "vulnerabilities" }, allowSetters = true)
    private Set<Risk> risks = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "proposals", "decisionPattern" }, allowSetters = true)
    private Collaboration collaboration;

    @OneToMany(mappedBy = "proposal")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "proposal", "user" }, allowSetters = true)
    private Set<Decision> decisions = new HashSet<>();

    @ManyToMany(mappedBy = "proposals")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "risks", "proposals", "mitigations", "threats" }, allowSetters = true)
    private Set<Vulnerability> vulnerabilities = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Proposal id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Proposal name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Proposal description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getCreationDate() {
        return this.creationDate;
    }

    public Proposal creationDate(LocalDate creationDate) {
        this.setCreationDate(creationDate);
        return this;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public ProposalState getProposalState() {
        return this.proposalState;
    }

    public Proposal proposalState(ProposalState proposalState) {
        this.setProposalState(proposalState);
        return this;
    }

    public void setProposalState(ProposalState proposalState) {
        this.proposalState = proposalState;
    }

    public Set<Change> getChanges() {
        return this.changes;
    }

    public void setChanges(Set<Change> changes) {
        if (this.changes != null) {
            this.changes.forEach(i -> i.setProposal(null));
        }
        if (changes != null) {
            changes.forEach(i -> i.setProposal(this));
        }
        this.changes = changes;
    }

    public Proposal changes(Set<Change> changes) {
        this.setChanges(changes);
        return this;
    }

    public Proposal addChange(Change change) {
        this.changes.add(change);
        change.setProposal(this);
        return this;
    }

    public Proposal removeChange(Change change) {
        this.changes.remove(change);
        change.setProposal(null);
        return this;
    }

    public InvolvedUser getUser() {
        return this.user;
    }

    public void setUser(InvolvedUser involvedUser) {
        this.user = involvedUser;
    }

    public Proposal user(InvolvedUser involvedUser) {
        this.setUser(involvedUser);
        return this;
    }

    public Set<Risk> getRisks() {
        return this.risks;
    }

    public void setRisks(Set<Risk> risks) {
        this.risks = risks;
    }

    public Proposal risks(Set<Risk> risks) {
        this.setRisks(risks);
        return this;
    }

    public Proposal addRisk(Risk risk) {
        this.risks.add(risk);
        risk.getProposals().add(this);
        return this;
    }

    public Proposal removeRisk(Risk risk) {
        this.risks.remove(risk);
        risk.getProposals().remove(this);
        return this;
    }

    public Collaboration getCollaboration() {
        return this.collaboration;
    }

    public void setCollaboration(Collaboration collaboration) {
        this.collaboration = collaboration;
    }

    public Proposal collaboration(Collaboration collaboration) {
        this.setCollaboration(collaboration);
        return this;
    }

    public Set<Decision> getDecisions() {
        return this.decisions;
    }

    public void setDecisions(Set<Decision> decisions) {
        if (this.decisions != null) {
            this.decisions.forEach(i -> i.setProposal(null));
        }
        if (decisions != null) {
            decisions.forEach(i -> i.setProposal(this));
        }
        this.decisions = decisions;
    }

    public Proposal decisions(Set<Decision> decisions) {
        this.setDecisions(decisions);
        return this;
    }

    public Proposal addDecisions(Decision decision) {
        this.decisions.add(decision);
        decision.setProposal(this);
        return this;
    }

    public Proposal removeDecisions(Decision decision) {
        this.decisions.remove(decision);
        decision.setProposal(null);
        return this;
    }

    public Set<Vulnerability> getVulnerabilities() {
        return this.vulnerabilities;
    }

    public void setVulnerabilities(Set<Vulnerability> vulnerabilities) {
        if (this.vulnerabilities != null) {
            this.vulnerabilities.forEach(i -> i.removeProposal(this));
        }
        if (vulnerabilities != null) {
            vulnerabilities.forEach(i -> i.addProposal(this));
        }
        this.vulnerabilities = vulnerabilities;
    }

    public Proposal vulnerabilities(Set<Vulnerability> vulnerabilities) {
        this.setVulnerabilities(vulnerabilities);
        return this;
    }

    public Proposal addVulnerability(Vulnerability vulnerability) {
        this.vulnerabilities.add(vulnerability);
        vulnerability.getProposals().add(this);
        return this;
    }

    public Proposal removeVulnerability(Vulnerability vulnerability) {
        this.vulnerabilities.remove(vulnerability);
        vulnerability.getProposals().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Proposal)) {
            return false;
        }
        return id != null && id.equals(((Proposal) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Proposal{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", creationDate='" + getCreationDate() + "'" +
            ", proposalState='" + getProposalState() + "'" +
            "}";
    }
}
