package org.csd.core.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.csd.core.IntegrationTest;
import org.csd.core.domain.Collaboration;
import org.csd.core.domain.enumeration.CollaborationState;
import org.csd.core.repository.CollaborationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CollaborationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CollaborationResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_START_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_DECISION_DURATION = 1;
    private static final Integer UPDATED_DECISION_DURATION = 2;

    private static final Integer DEFAULT_EVALUATION_DURATION = 1;
    private static final Integer UPDATED_EVALUATION_DURATION = 2;

    private static final CollaborationState DEFAULT_COLLABORATION_STATE = CollaborationState.ACTIVE;
    private static final CollaborationState UPDATED_COLLABORATION_STATE = CollaborationState.TERMINATED;

    private static final String ENTITY_API_URL = "/api/collaborations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CollaborationRepository collaborationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCollaborationMockMvc;

    private Collaboration collaboration;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Collaboration createEntity(EntityManager em) {
        Collaboration collaboration = new Collaboration()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .startDate(DEFAULT_START_DATE)
            .decisionDuration(DEFAULT_DECISION_DURATION)
            .evaluationDuration(DEFAULT_EVALUATION_DURATION)
            .collaborationState(DEFAULT_COLLABORATION_STATE);
        return collaboration;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Collaboration createUpdatedEntity(EntityManager em) {
        Collaboration collaboration = new Collaboration()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .startDate(UPDATED_START_DATE)
            .decisionDuration(UPDATED_DECISION_DURATION)
            .evaluationDuration(UPDATED_EVALUATION_DURATION)
            .collaborationState(UPDATED_COLLABORATION_STATE);
        return collaboration;
    }

    @BeforeEach
    public void initTest() {
        collaboration = createEntity(em);
    }

    @Test
    @Transactional
    void createCollaboration() throws Exception {
        int databaseSizeBeforeCreate = collaborationRepository.findAll().size();
        // Create the Collaboration
        restCollaborationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(collaboration)))
            .andExpect(status().isCreated());

        // Validate the Collaboration in the database
        List<Collaboration> collaborationList = collaborationRepository.findAll();
        assertThat(collaborationList).hasSize(databaseSizeBeforeCreate + 1);
        Collaboration testCollaboration = collaborationList.get(collaborationList.size() - 1);
        assertThat(testCollaboration.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCollaboration.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCollaboration.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testCollaboration.getDecisionDuration()).isEqualTo(DEFAULT_DECISION_DURATION);
        assertThat(testCollaboration.getEvaluationDuration()).isEqualTo(DEFAULT_EVALUATION_DURATION);
        assertThat(testCollaboration.getCollaborationState()).isEqualTo(DEFAULT_COLLABORATION_STATE);
    }

    @Test
    @Transactional
    void createCollaborationWithExistingId() throws Exception {
        // Create the Collaboration with an existing ID
        collaboration.setId(1L);

        int databaseSizeBeforeCreate = collaborationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCollaborationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(collaboration)))
            .andExpect(status().isBadRequest());

        // Validate the Collaboration in the database
        List<Collaboration> collaborationList = collaborationRepository.findAll();
        assertThat(collaborationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCollaborations() throws Exception {
        // Initialize the database
        collaborationRepository.saveAndFlush(collaboration);

        // Get all the collaborationList
        restCollaborationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(collaboration.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].decisionDuration").value(hasItem(DEFAULT_DECISION_DURATION)))
            .andExpect(jsonPath("$.[*].evaluationDuration").value(hasItem(DEFAULT_EVALUATION_DURATION)))
            .andExpect(jsonPath("$.[*].collaborationState").value(hasItem(DEFAULT_COLLABORATION_STATE.toString())));
    }

    @Test
    @Transactional
    void getCollaboration() throws Exception {
        // Initialize the database
        collaborationRepository.saveAndFlush(collaboration);

        // Get the collaboration
        restCollaborationMockMvc
            .perform(get(ENTITY_API_URL_ID, collaboration.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(collaboration.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.decisionDuration").value(DEFAULT_DECISION_DURATION))
            .andExpect(jsonPath("$.evaluationDuration").value(DEFAULT_EVALUATION_DURATION))
            .andExpect(jsonPath("$.collaborationState").value(DEFAULT_COLLABORATION_STATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingCollaboration() throws Exception {
        // Get the collaboration
        restCollaborationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCollaboration() throws Exception {
        // Initialize the database
        collaborationRepository.saveAndFlush(collaboration);

        int databaseSizeBeforeUpdate = collaborationRepository.findAll().size();

        // Update the collaboration
        Collaboration updatedCollaboration = collaborationRepository.findById(collaboration.getId()).get();
        // Disconnect from session so that the updates on updatedCollaboration are not directly saved in db
        em.detach(updatedCollaboration);
        updatedCollaboration
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .startDate(UPDATED_START_DATE)
            .decisionDuration(UPDATED_DECISION_DURATION)
            .evaluationDuration(UPDATED_EVALUATION_DURATION)
            .collaborationState(UPDATED_COLLABORATION_STATE);

        restCollaborationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCollaboration.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCollaboration))
            )
            .andExpect(status().isOk());

        // Validate the Collaboration in the database
        List<Collaboration> collaborationList = collaborationRepository.findAll();
        assertThat(collaborationList).hasSize(databaseSizeBeforeUpdate);
        Collaboration testCollaboration = collaborationList.get(collaborationList.size() - 1);
        assertThat(testCollaboration.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCollaboration.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCollaboration.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testCollaboration.getDecisionDuration()).isEqualTo(UPDATED_DECISION_DURATION);
        assertThat(testCollaboration.getEvaluationDuration()).isEqualTo(UPDATED_EVALUATION_DURATION);
        assertThat(testCollaboration.getCollaborationState()).isEqualTo(UPDATED_COLLABORATION_STATE);
    }

    @Test
    @Transactional
    void putNonExistingCollaboration() throws Exception {
        int databaseSizeBeforeUpdate = collaborationRepository.findAll().size();
        collaboration.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCollaborationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, collaboration.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(collaboration))
            )
            .andExpect(status().isBadRequest());

        // Validate the Collaboration in the database
        List<Collaboration> collaborationList = collaborationRepository.findAll();
        assertThat(collaborationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCollaboration() throws Exception {
        int databaseSizeBeforeUpdate = collaborationRepository.findAll().size();
        collaboration.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCollaborationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(collaboration))
            )
            .andExpect(status().isBadRequest());

        // Validate the Collaboration in the database
        List<Collaboration> collaborationList = collaborationRepository.findAll();
        assertThat(collaborationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCollaboration() throws Exception {
        int databaseSizeBeforeUpdate = collaborationRepository.findAll().size();
        collaboration.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCollaborationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(collaboration)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Collaboration in the database
        List<Collaboration> collaborationList = collaborationRepository.findAll();
        assertThat(collaborationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCollaborationWithPatch() throws Exception {
        // Initialize the database
        collaborationRepository.saveAndFlush(collaboration);

        int databaseSizeBeforeUpdate = collaborationRepository.findAll().size();

        // Update the collaboration using partial update
        Collaboration partialUpdatedCollaboration = new Collaboration();
        partialUpdatedCollaboration.setId(collaboration.getId());

        partialUpdatedCollaboration.decisionDuration(UPDATED_DECISION_DURATION).collaborationState(UPDATED_COLLABORATION_STATE);

        restCollaborationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCollaboration.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCollaboration))
            )
            .andExpect(status().isOk());

        // Validate the Collaboration in the database
        List<Collaboration> collaborationList = collaborationRepository.findAll();
        assertThat(collaborationList).hasSize(databaseSizeBeforeUpdate);
        Collaboration testCollaboration = collaborationList.get(collaborationList.size() - 1);
        assertThat(testCollaboration.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCollaboration.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCollaboration.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testCollaboration.getDecisionDuration()).isEqualTo(UPDATED_DECISION_DURATION);
        assertThat(testCollaboration.getEvaluationDuration()).isEqualTo(DEFAULT_EVALUATION_DURATION);
        assertThat(testCollaboration.getCollaborationState()).isEqualTo(UPDATED_COLLABORATION_STATE);
    }

    @Test
    @Transactional
    void fullUpdateCollaborationWithPatch() throws Exception {
        // Initialize the database
        collaborationRepository.saveAndFlush(collaboration);

        int databaseSizeBeforeUpdate = collaborationRepository.findAll().size();

        // Update the collaboration using partial update
        Collaboration partialUpdatedCollaboration = new Collaboration();
        partialUpdatedCollaboration.setId(collaboration.getId());

        partialUpdatedCollaboration
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .startDate(UPDATED_START_DATE)
            .decisionDuration(UPDATED_DECISION_DURATION)
            .evaluationDuration(UPDATED_EVALUATION_DURATION)
            .collaborationState(UPDATED_COLLABORATION_STATE);

        restCollaborationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCollaboration.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCollaboration))
            )
            .andExpect(status().isOk());

        // Validate the Collaboration in the database
        List<Collaboration> collaborationList = collaborationRepository.findAll();
        assertThat(collaborationList).hasSize(databaseSizeBeforeUpdate);
        Collaboration testCollaboration = collaborationList.get(collaborationList.size() - 1);
        assertThat(testCollaboration.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCollaboration.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCollaboration.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testCollaboration.getDecisionDuration()).isEqualTo(UPDATED_DECISION_DURATION);
        assertThat(testCollaboration.getEvaluationDuration()).isEqualTo(UPDATED_EVALUATION_DURATION);
        assertThat(testCollaboration.getCollaborationState()).isEqualTo(UPDATED_COLLABORATION_STATE);
    }

    @Test
    @Transactional
    void patchNonExistingCollaboration() throws Exception {
        int databaseSizeBeforeUpdate = collaborationRepository.findAll().size();
        collaboration.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCollaborationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, collaboration.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(collaboration))
            )
            .andExpect(status().isBadRequest());

        // Validate the Collaboration in the database
        List<Collaboration> collaborationList = collaborationRepository.findAll();
        assertThat(collaborationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCollaboration() throws Exception {
        int databaseSizeBeforeUpdate = collaborationRepository.findAll().size();
        collaboration.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCollaborationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(collaboration))
            )
            .andExpect(status().isBadRequest());

        // Validate the Collaboration in the database
        List<Collaboration> collaborationList = collaborationRepository.findAll();
        assertThat(collaborationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCollaboration() throws Exception {
        int databaseSizeBeforeUpdate = collaborationRepository.findAll().size();
        collaboration.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCollaborationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(collaboration))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Collaboration in the database
        List<Collaboration> collaborationList = collaborationRepository.findAll();
        assertThat(collaborationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCollaboration() throws Exception {
        // Initialize the database
        collaborationRepository.saveAndFlush(collaboration);

        int databaseSizeBeforeDelete = collaborationRepository.findAll().size();

        // Delete the collaboration
        restCollaborationMockMvc
            .perform(delete(ENTITY_API_URL_ID, collaboration.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Collaboration> collaborationList = collaborationRepository.findAll();
        assertThat(collaborationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
