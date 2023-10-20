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
import org.csd.core.domain.CodecisionMethod;
import org.csd.core.domain.DecisionPattern;
import org.csd.core.domain.ParticipationMethod;
import org.csd.core.repository.DecisionPatternRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link DecisionPatternResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DecisionPatternResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/decision-patterns";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DecisionPatternRepository decisionPatternRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDecisionPatternMockMvc;

    private DecisionPattern decisionPattern;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DecisionPattern createEntity(EntityManager em) {
        DecisionPattern decisionPattern = new DecisionPattern().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION);
        // Add required entity
        ParticipationMethod participationMethod;
        if (TestUtil.findAll(em, ParticipationMethod.class).isEmpty()) {
            participationMethod = ParticipationMethodResourceIT.createEntity(em);
            em.persist(participationMethod);
            em.flush();
        } else {
            participationMethod = TestUtil.findAll(em, ParticipationMethod.class).get(0);
        }
        decisionPattern.setParticipationMethod(participationMethod);
        // Add required entity
        CodecisionMethod codecisionMethod;
        if (TestUtil.findAll(em, CodecisionMethod.class).isEmpty()) {
            codecisionMethod = CodecisionMethodResourceIT.createEntity(em);
            em.persist(codecisionMethod);
            em.flush();
        } else {
            codecisionMethod = TestUtil.findAll(em, CodecisionMethod.class).get(0);
        }
        decisionPattern.setCodecisionMethod(codecisionMethod);
        return decisionPattern;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DecisionPattern createUpdatedEntity(EntityManager em) {
        DecisionPattern decisionPattern = new DecisionPattern().name(UPDATED_NAME).description(UPDATED_DESCRIPTION);
        // Add required entity
        ParticipationMethod participationMethod;
        if (TestUtil.findAll(em, ParticipationMethod.class).isEmpty()) {
            participationMethod = ParticipationMethodResourceIT.createUpdatedEntity(em);
            em.persist(participationMethod);
            em.flush();
        } else {
            participationMethod = TestUtil.findAll(em, ParticipationMethod.class).get(0);
        }
        decisionPattern.setParticipationMethod(participationMethod);
        // Add required entity
        CodecisionMethod codecisionMethod;
        if (TestUtil.findAll(em, CodecisionMethod.class).isEmpty()) {
            codecisionMethod = CodecisionMethodResourceIT.createUpdatedEntity(em);
            em.persist(codecisionMethod);
            em.flush();
        } else {
            codecisionMethod = TestUtil.findAll(em, CodecisionMethod.class).get(0);
        }
        decisionPattern.setCodecisionMethod(codecisionMethod);
        return decisionPattern;
    }

    @BeforeEach
    public void initTest() {
        decisionPattern = createEntity(em);
    }

    @Test
    @Transactional
    void createDecisionPattern() throws Exception {
        int databaseSizeBeforeCreate = decisionPatternRepository.findAll().size();
        // Create the DecisionPattern
        restDecisionPatternMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decisionPattern))
            )
            .andExpect(status().isCreated());

        // Validate the DecisionPattern in the database
        List<DecisionPattern> decisionPatternList = decisionPatternRepository.findAll();
        assertThat(decisionPatternList).hasSize(databaseSizeBeforeCreate + 1);
        DecisionPattern testDecisionPattern = decisionPatternList.get(decisionPatternList.size() - 1);
        assertThat(testDecisionPattern.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testDecisionPattern.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createDecisionPatternWithExistingId() throws Exception {
        // Create the DecisionPattern with an existing ID
        decisionPattern.setId(1L);

        int databaseSizeBeforeCreate = decisionPatternRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDecisionPatternMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decisionPattern))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecisionPattern in the database
        List<DecisionPattern> decisionPatternList = decisionPatternRepository.findAll();
        assertThat(decisionPatternList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDecisionPatterns() throws Exception {
        // Initialize the database
        decisionPatternRepository.saveAndFlush(decisionPattern);

        // Get all the decisionPatternList
        restDecisionPatternMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(decisionPattern.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getDecisionPattern() throws Exception {
        // Initialize the database
        decisionPatternRepository.saveAndFlush(decisionPattern);

        // Get the decisionPattern
        restDecisionPatternMockMvc
            .perform(get(ENTITY_API_URL_ID, decisionPattern.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(decisionPattern.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingDecisionPattern() throws Exception {
        // Get the decisionPattern
        restDecisionPatternMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDecisionPattern() throws Exception {
        // Initialize the database
        decisionPatternRepository.saveAndFlush(decisionPattern);

        int databaseSizeBeforeUpdate = decisionPatternRepository.findAll().size();

        // Update the decisionPattern
        DecisionPattern updatedDecisionPattern = decisionPatternRepository.findById(decisionPattern.getId()).get();
        // Disconnect from session so that the updates on updatedDecisionPattern are not directly saved in db
        em.detach(updatedDecisionPattern);
        updatedDecisionPattern.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restDecisionPatternMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDecisionPattern.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDecisionPattern))
            )
            .andExpect(status().isOk());

        // Validate the DecisionPattern in the database
        List<DecisionPattern> decisionPatternList = decisionPatternRepository.findAll();
        assertThat(decisionPatternList).hasSize(databaseSizeBeforeUpdate);
        DecisionPattern testDecisionPattern = decisionPatternList.get(decisionPatternList.size() - 1);
        assertThat(testDecisionPattern.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDecisionPattern.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingDecisionPattern() throws Exception {
        int databaseSizeBeforeUpdate = decisionPatternRepository.findAll().size();
        decisionPattern.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDecisionPatternMockMvc
            .perform(
                put(ENTITY_API_URL_ID, decisionPattern.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(decisionPattern))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecisionPattern in the database
        List<DecisionPattern> decisionPatternList = decisionPatternRepository.findAll();
        assertThat(decisionPatternList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDecisionPattern() throws Exception {
        int databaseSizeBeforeUpdate = decisionPatternRepository.findAll().size();
        decisionPattern.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecisionPatternMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(decisionPattern))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecisionPattern in the database
        List<DecisionPattern> decisionPatternList = decisionPatternRepository.findAll();
        assertThat(decisionPatternList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDecisionPattern() throws Exception {
        int databaseSizeBeforeUpdate = decisionPatternRepository.findAll().size();
        decisionPattern.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecisionPatternMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decisionPattern))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DecisionPattern in the database
        List<DecisionPattern> decisionPatternList = decisionPatternRepository.findAll();
        assertThat(decisionPatternList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDecisionPatternWithPatch() throws Exception {
        // Initialize the database
        decisionPatternRepository.saveAndFlush(decisionPattern);

        int databaseSizeBeforeUpdate = decisionPatternRepository.findAll().size();

        // Update the decisionPattern using partial update
        DecisionPattern partialUpdatedDecisionPattern = new DecisionPattern();
        partialUpdatedDecisionPattern.setId(decisionPattern.getId());

        partialUpdatedDecisionPattern.description(UPDATED_DESCRIPTION);

        restDecisionPatternMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDecisionPattern.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDecisionPattern))
            )
            .andExpect(status().isOk());

        // Validate the DecisionPattern in the database
        List<DecisionPattern> decisionPatternList = decisionPatternRepository.findAll();
        assertThat(decisionPatternList).hasSize(databaseSizeBeforeUpdate);
        DecisionPattern testDecisionPattern = decisionPatternList.get(decisionPatternList.size() - 1);
        assertThat(testDecisionPattern.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testDecisionPattern.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateDecisionPatternWithPatch() throws Exception {
        // Initialize the database
        decisionPatternRepository.saveAndFlush(decisionPattern);

        int databaseSizeBeforeUpdate = decisionPatternRepository.findAll().size();

        // Update the decisionPattern using partial update
        DecisionPattern partialUpdatedDecisionPattern = new DecisionPattern();
        partialUpdatedDecisionPattern.setId(decisionPattern.getId());

        partialUpdatedDecisionPattern.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restDecisionPatternMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDecisionPattern.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDecisionPattern))
            )
            .andExpect(status().isOk());

        // Validate the DecisionPattern in the database
        List<DecisionPattern> decisionPatternList = decisionPatternRepository.findAll();
        assertThat(decisionPatternList).hasSize(databaseSizeBeforeUpdate);
        DecisionPattern testDecisionPattern = decisionPatternList.get(decisionPatternList.size() - 1);
        assertThat(testDecisionPattern.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDecisionPattern.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingDecisionPattern() throws Exception {
        int databaseSizeBeforeUpdate = decisionPatternRepository.findAll().size();
        decisionPattern.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDecisionPatternMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, decisionPattern.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(decisionPattern))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecisionPattern in the database
        List<DecisionPattern> decisionPatternList = decisionPatternRepository.findAll();
        assertThat(decisionPatternList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDecisionPattern() throws Exception {
        int databaseSizeBeforeUpdate = decisionPatternRepository.findAll().size();
        decisionPattern.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecisionPatternMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(decisionPattern))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecisionPattern in the database
        List<DecisionPattern> decisionPatternList = decisionPatternRepository.findAll();
        assertThat(decisionPatternList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDecisionPattern() throws Exception {
        int databaseSizeBeforeUpdate = decisionPatternRepository.findAll().size();
        decisionPattern.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecisionPatternMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(decisionPattern))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DecisionPattern in the database
        List<DecisionPattern> decisionPatternList = decisionPatternRepository.findAll();
        assertThat(decisionPatternList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDecisionPattern() throws Exception {
        // Initialize the database
        decisionPatternRepository.saveAndFlush(decisionPattern);

        int databaseSizeBeforeDelete = decisionPatternRepository.findAll().size();

        // Delete the decisionPattern
        restDecisionPatternMockMvc
            .perform(delete(ENTITY_API_URL_ID, decisionPattern.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DecisionPattern> decisionPatternList = decisionPatternRepository.findAll();
        assertThat(decisionPatternList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
