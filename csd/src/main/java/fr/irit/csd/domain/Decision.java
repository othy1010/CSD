package fr.irit.csd.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import fr.irit.csd.domain.enumeration.AgreementType;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Decision.
 */
@Entity
@Table(name = "decision")
//@cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Decision implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "agreement")
    private AgreementType agreement;

    @Column(name = "comment")
    private String comment;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "changes", "user", "risks", "collaboration", "decisions", "vulnerabilities" }, allowSetters = true)
    private Proposal proposal;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "user", "decisions", "proposals" }, allowSetters = true)
    private InvolvedUser user;

    // Csd-needle-entity-add-field - Csd will add fields here

    public Long getId() {
        return this.id;
    }

    public Decision id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AgreementType getAgreement() {
        return this.agreement;
    }

    public Decision agreement(AgreementType agreement) {
        this.setAgreement(agreement);
        return this;
    }

    public void setAgreement(AgreementType agreement) {
        this.agreement = agreement;
    }

    public String getComment() {
        return this.comment;
    }

    public Decision comment(String comment) {
        this.setComment(comment);
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Proposal getProposal() {
        return this.proposal;
    }

    public void setProposal(Proposal proposal) {
        this.proposal = proposal;
    }

    public Decision proposal(Proposal proposal) {
        this.setProposal(proposal);
        return this;
    }

    public InvolvedUser getUser() {
        return this.user;
    }

    public void setUser(InvolvedUser involvedUser) {
        this.user = involvedUser;
    }

    public Decision user(InvolvedUser involvedUser) {
        this.setUser(involvedUser);
        return this;
    }

    // Csd-needle-entity-add-getters-setters - Csd will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Decision)) {
            return false;
        }
        return id != null && id.equals(((Decision) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Decision{" +
            "id=" + getId() +
            ", agreement='" + getAgreement() + "'" +
            ", comment='" + getComment() + "'" +
            "}";
    }
}
