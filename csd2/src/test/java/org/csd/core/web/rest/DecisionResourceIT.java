package org.csd.core.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.csd.core.IntegrationTest;
import org.csd.core.domain.Decision;
import org.csd.core.domain.InvolvedUser;
import org.csd.core.domain.Proposal;
import org.csd.core.domain.enumeration.AgreementType;
import org.csd.core.repository.DecisionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link DecisionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DecisionResourceIT {

    private static final AgreementType DEFAULT_AGREEMENT = AgreementType.APPROVED;
    private static final AgreementType UPDATED_AGREEMENT = AgreementType.REJECTED;

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/decisions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DecisionRepository decisionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDecisionMockMvc;

    private Decision decision;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Decision createEntity(EntityManager em) {
        Decision decision = new Decision().agreement(DEFAULT_AGREEMENT).comment(DEFAULT_COMMENT);
        // Add required entity
        Proposal proposal;
        if (TestUtil.findAll(em, Proposal.class).isEmpty()) {
            proposal = ProposalResourceIT.createEntity(em);
            em.persist(proposal);
            em.flush();
        } else {
            proposal = TestUtil.findAll(em, Proposal.class).get(0);
        }
        decision.setProposal(proposal);
        // Add required entity
        InvolvedUser involvedUser;
        if (TestUtil.findAll(em, InvolvedUser.class).isEmpty()) {
            involvedUser = InvolvedUserResourceIT.createEntity(em);
            em.persist(involvedUser);
            em.flush();
        } else {
            involvedUser = TestUtil.findAll(em, InvolvedUser.class).get(0);
        }
        decision.setUser(involvedUser);
        return decision;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Decision createUpdatedEntity(EntityManager em) {
        Decision decision = new Decision().agreement(UPDATED_AGREEMENT).comment(UPDATED_COMMENT);
        // Add required entity
        Proposal proposal;
        if (TestUtil.findAll(em, Proposal.class).isEmpty()) {
            proposal = ProposalResourceIT.createUpdatedEntity(em);
            em.persist(proposal);
            em.flush();
        } else {
            proposal = TestUtil.findAll(em, Proposal.class).get(0);
        }
        decision.setProposal(proposal);
        // Add required entity
        InvolvedUser involvedUser;
        if (TestUtil.findAll(em, InvolvedUser.class).isEmpty()) {
            involvedUser = InvolvedUserResourceIT.createUpdatedEntity(em);
            em.persist(involvedUser);
            em.flush();
        } else {
            involvedUser = TestUtil.findAll(em, InvolvedUser.class).get(0);
        }
        decision.setUser(involvedUser);
        return decision;
    }

    @BeforeEach
    public void initTest() {
        decision = createEntity(em);
    }

    @Test
    @Transactional
    void createDecision() throws Exception {
        int databaseSizeBeforeCreate = decisionRepository.findAll().size();
        // Create the Decision
        restDecisionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decision)))
            .andExpect(status().isCreated());

        // Validate the Decision in the database
        List<Decision> decisionList = decisionRepository.findAll();
        assertThat(decisionList).hasSize(databaseSizeBeforeCreate + 1);
        Decision testDecision = decisionList.get(decisionList.size() - 1);
        assertThat(testDecision.getAgreement()).isEqualTo(DEFAULT_AGREEMENT);
        assertThat(testDecision.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void createDecisionWithExistingId() throws Exception {
        // Create the Decision with an existing ID
        decision.setId(1L);

        int databaseSizeBeforeCreate = decisionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDecisionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decision)))
            .andExpect(status().isBadRequest());

        // Validate the Decision in the database
        List<Decision> decisionList = decisionRepository.findAll();
        assertThat(decisionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDecisions() throws Exception {
        // Initialize the database
        decisionRepository.saveAndFlush(decision);

        // Get all the decisionList
        restDecisionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(decision.getId().intValue())))
            .andExpect(jsonPath("$.[*].agreement").value(hasItem(DEFAULT_AGREEMENT.toString())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)));
    }

    @Test
    @Transactional
    void getDecision() throws Exception {
        // Initialize the database
        decisionRepository.saveAndFlush(decision);

        // Get the decision
        restDecisionMockMvc
            .perform(get(ENTITY_API_URL_ID, decision.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(decision.getId().intValue()))
            .andExpect(jsonPath("$.agreement").value(DEFAULT_AGREEMENT.toString()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT));
    }

    @Test
    @Transactional
    void getNonExistingDecision() throws Exception {
        // Get the decision
        restDecisionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDecision() throws Exception {
        // Initialize the database
        decisionRepository.saveAndFlush(decision);

        int databaseSizeBeforeUpdate = decisionRepository.findAll().size();

        // Update the decision
        Decision updatedDecision = decisionRepository.findById(decision.getId()).get();
        // Disconnect from session so that the updates on updatedDecision are not directly saved in db
        em.detach(updatedDecision);
        updatedDecision.agreement(UPDATED_AGREEMENT).comment(UPDATED_COMMENT);

        restDecisionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDecision.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDecision))
            )
            .andExpect(status().isOk());

        // Validate the Decision in the database
        List<Decision> decisionList = decisionRepository.findAll();
        assertThat(decisionList).hasSize(databaseSizeBeforeUpdate);
        Decision testDecision = decisionList.get(decisionList.size() - 1);
        assertThat(testDecision.getAgreement()).isEqualTo(UPDATED_AGREEMENT);
        assertThat(testDecision.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void putNonExistingDecision() throws Exception {
        int databaseSizeBeforeUpdate = decisionRepository.findAll().size();
        decision.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDecisionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, decision.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(decision))
            )
            .andExpect(status().isBadRequest());

        // Validate the Decision in the database
        List<Decision> decisionList = decisionRepository.findAll();
        assertThat(decisionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDecision() throws Exception {
        int databaseSizeBeforeUpdate = decisionRepository.findAll().size();
        decision.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecisionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(decision))
            )
            .andExpect(status().isBadRequest());

        // Validate the Decision in the database
        List<Decision> decisionList = decisionRepository.findAll();
        assertThat(decisionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDecision() throws Exception {
        int databaseSizeBeforeUpdate = decisionRepository.findAll().size();
        decision.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecisionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decision)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Decision in the database
        List<Decision> decisionList = decisionRepository.findAll();
        assertThat(decisionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDecisionWithPatch() throws Exception {
        // Initialize the database
        decisionRepository.saveAndFlush(decision);

        int databaseSizeBeforeUpdate = decisionRepository.findAll().size();

        // Update the decision using partial update
        Decision partialUpdatedDecision = new Decision();
        partialUpdatedDecision.setId(decision.getId());

        partialUpdatedDecision.agreement(UPDATED_AGREEMENT);

        restDecisionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDecision.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDecision))
            )
            .andExpect(status().isOk());

        // Validate the Decision in the database
        List<Decision> decisionList = decisionRepository.findAll();
        assertThat(decisionList).hasSize(databaseSizeBeforeUpdate);
        Decision testDecision = decisionList.get(decisionList.size() - 1);
        assertThat(testDecision.getAgreement()).isEqualTo(UPDATED_AGREEMENT);
        assertThat(testDecision.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void fullUpdateDecisionWithPatch() throws Exception {
        // Initialize the database
        decisionRepository.saveAndFlush(decision);

        int databaseSizeBeforeUpdate = decisionRepository.findAll().size();

        // Update the decision using partial update
        Decision partialUpdatedDecision = new Decision();
        partialUpdatedDecision.setId(decision.getId());

        partialUpdatedDecision.agreement(UPDATED_AGREEMENT).comment(UPDATED_COMMENT);

        restDecisionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDecision.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDecision))
            )
            .andExpect(status().isOk());

        // Validate the Decision in the database
        List<Decision> decisionList = decisionRepository.findAll();
        assertThat(decisionList).hasSize(databaseSizeBeforeUpdate);
        Decision testDecision = decisionList.get(decisionList.size() - 1);
        assertThat(testDecision.getAgreement()).isEqualTo(UPDATED_AGREEMENT);
        assertThat(testDecision.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void patchNonExistingDecision() throws Exception {
        int databaseSizeBeforeUpdate = decisionRepository.findAll().size();
        decision.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDecisionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, decision.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(decision))
            )
            .andExpect(status().isBadRequest());

        // Validate the Decision in the database
        List<Decision> decisionList = decisionRepository.findAll();
        assertThat(decisionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDecision() throws Exception {
        int databaseSizeBeforeUpdate = decisionRepository.findAll().size();
        decision.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecisionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(decision))
            )
            .andExpect(status().isBadRequest());

        // Validate the Decision in the database
        List<Decision> decisionList = decisionRepository.findAll();
        assertThat(decisionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDecision() throws Exception {
        int databaseSizeBeforeUpdate = decisionRepository.findAll().size();
        decision.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecisionMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(decision)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Decision in the database
        List<Decision> decisionList = decisionRepository.findAll();
        assertThat(decisionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDecision() throws Exception {
        // Initialize the database
        decisionRepository.saveAndFlush(decision);

        int databaseSizeBeforeDelete = decisionRepository.findAll().size();

        // Delete the decision
        restDecisionMockMvc
            .perform(delete(ENTITY_API_URL_ID, decision.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Decision> decisionList = decisionRepository.findAll();
        assertThat(decisionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
