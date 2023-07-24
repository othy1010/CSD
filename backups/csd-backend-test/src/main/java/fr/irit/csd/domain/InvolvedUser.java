package fr.irit.csd.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import fr.irit.csd.domain.enumeration.UserRole;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A InvolvedUser.
 */
@Entity
@Table(name = "involved_user")
//@cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class InvolvedUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "expertise_level")
    private Integer expertiseLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_role")
    private UserRole userRole;

    @Column(name = "is_moderator")
    private Boolean isModerator;

    @Column(name = "is_eligible_dm")
    private Boolean isEligibleDM;

    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private User user;

    @OneToMany(mappedBy = "user")
    //@cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "proposal", "user" }, allowSetters = true)
    private Set<Decision> decisions = new HashSet<>();

    @OneToMany(mappedBy = "user")
    //@cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "changes", "user", "risks", "collaboration", "decisions", "vulnerabilities" }, allowSetters = true)
    private Set<Proposal> proposals = new HashSet<>();

    // Csd-needle-entity-add-field - Csd will add fields here

    public Long getId() {
        return this.id;
    }

    public InvolvedUser id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getExpertiseLevel() {
        return this.expertiseLevel;
    }

    public InvolvedUser expertiseLevel(Integer expertiseLevel) {
        this.setExpertiseLevel(expertiseLevel);
        return this;
    }

    public void setExpertiseLevel(Integer expertiseLevel) {
        this.expertiseLevel = expertiseLevel;
    }

    public UserRole getUserRole() {
        return this.userRole;
    }

    public InvolvedUser userRole(UserRole userRole) {
        this.setUserRole(userRole);
        return this;
    }

    public void setUserRole(UserRole userRole) {
        this.userRole = userRole;
    }

    public Boolean getIsModerator() {
        return this.isModerator;
    }

    public InvolvedUser isModerator(Boolean isModerator) {
        this.setIsModerator(isModerator);
        return this;
    }

    public void setIsModerator(Boolean isModerator) {
        this.isModerator = isModerator;
    }

    public Boolean getIsEligibleDM() {
        return this.isEligibleDM;
    }

    public InvolvedUser isEligibleDM(Boolean isEligibleDM) {
        this.setIsEligibleDM(isEligibleDM);
        return this;
    }

    public void setIsEligibleDM(Boolean isEligibleDM) {
        this.isEligibleDM = isEligibleDM;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public InvolvedUser user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<Decision> getDecisions() {
        return this.decisions;
    }

    public void setDecisions(Set<Decision> decisions) {
        if (this.decisions != null) {
            this.decisions.forEach(i -> i.setUser(null));
        }
        if (decisions != null) {
            decisions.forEach(i -> i.setUser(this));
        }
        this.decisions = decisions;
    }

    public InvolvedUser decisions(Set<Decision> decisions) {
        this.setDecisions(decisions);
        return this;
    }

    public InvolvedUser addDecisions(Decision decision) {
        this.decisions.add(decision);
        decision.setUser(this);
        return this;
    }

    public InvolvedUser removeDecisions(Decision decision) {
        this.decisions.remove(decision);
        decision.setUser(null);
        return this;
    }

    public Set<Proposal> getProposals() {
        return this.proposals;
    }

    public void setProposals(Set<Proposal> proposals) {
        if (this.proposals != null) {
            this.proposals.forEach(i -> i.setUser(null));
        }
        if (proposals != null) {
            proposals.forEach(i -> i.setUser(this));
        }
        this.proposals = proposals;
    }

    public InvolvedUser proposals(Set<Proposal> proposals) {
        this.setProposals(proposals);
        return this;
    }

    public InvolvedUser addProposals(Proposal proposal) {
        this.proposals.add(proposal);
        proposal.setUser(this);
        return this;
    }

    public InvolvedUser removeProposals(Proposal proposal) {
        this.proposals.remove(proposal);
        proposal.setUser(null);
        return this;
    }

    // Csd-needle-entity-add-getters-setters - Csd will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof InvolvedUser)) {
            return false;
        }
        return id != null && id.equals(((InvolvedUser) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "InvolvedUser{" +
            "id=" + getId() +
            ", expertiseLevel=" + getExpertiseLevel() +
            ", userRole='" + getUserRole() + "'" +
            ", isModerator='" + getIsModerator() + "'" +
            ", isEligibleDM='" + getIsEligibleDM() + "'" +
            "}";
    }
}
