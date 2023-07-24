package org.csd.core.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.csd.core.domain.enumeration.AgreementThreshold;
import org.csd.core.domain.enumeration.EvaluationKind;
import org.csd.core.domain.enumeration.ProcessKind;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CodecisionMethod.
 */
@Entity
@Table(name = "codecision_method")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CodecisionMethod implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "process_kind")
    private ProcessKind processKind;

    @Enumerated(EnumType.STRING)
    @Column(name = "evaluation_kind")
    private EvaluationKind evaluationKind;

    @Enumerated(EnumType.STRING)
    @Column(name = "agreement_threshold")
    private AgreementThreshold agreementThreshold;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CodecisionMethod id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProcessKind getProcessKind() {
        return this.processKind;
    }

    public CodecisionMethod processKind(ProcessKind processKind) {
        this.setProcessKind(processKind);
        return this;
    }

    public void setProcessKind(ProcessKind processKind) {
        this.processKind = processKind;
    }

    public EvaluationKind getEvaluationKind() {
        return this.evaluationKind;
    }

    public CodecisionMethod evaluationKind(EvaluationKind evaluationKind) {
        this.setEvaluationKind(evaluationKind);
        return this;
    }

    public void setEvaluationKind(EvaluationKind evaluationKind) {
        this.evaluationKind = evaluationKind;
    }

    public AgreementThreshold getAgreementThreshold() {
        return this.agreementThreshold;
    }

    public CodecisionMethod agreementThreshold(AgreementThreshold agreementThreshold) {
        this.setAgreementThreshold(agreementThreshold);
        return this;
    }

    public void setAgreementThreshold(AgreementThreshold agreementThreshold) {
        this.agreementThreshold = agreementThreshold;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CodecisionMethod)) {
            return false;
        }
        return id != null && id.equals(((CodecisionMethod) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CodecisionMethod{" +
            "id=" + getId() +
            ", processKind='" + getProcessKind() + "'" +
            ", evaluationKind='" + getEvaluationKind() + "'" +
            ", agreementThreshold='" + getAgreementThreshold() + "'" +
            "}";
    }
}
