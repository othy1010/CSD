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
import org.csd.core.domain.SelectionCriteria;
import org.csd.core.domain.enumeration.SelectionCriteriaType;
import org.csd.core.repository.SelectionCriteriaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SelectionCriteriaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SelectionCriteriaResourceIT {

    private static final SelectionCriteriaType DEFAULT_CRITERION = SelectionCriteriaType.EXPERTISELEVEL;
    private static final SelectionCriteriaType UPDATED_CRITERION = SelectionCriteriaType.EXPERTISEDOMAIN;

    private static final String ENTITY_API_URL = "/api/selection-criteria";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SelectionCriteriaRepository selectionCriteriaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSelectionCriteriaMockMvc;

    private SelectionCriteria selectionCriteria;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SelectionCriteria createEntity(EntityManager em) {
        SelectionCriteria selectionCriteria = new SelectionCriteria().criterion(DEFAULT_CRITERION);
        return selectionCriteria;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SelectionCriteria createUpdatedEntity(EntityManager em) {
        SelectionCriteria selectionCriteria = new SelectionCriteria().criterion(UPDATED_CRITERION);
        return selectionCriteria;
    }

    @BeforeEach
    public void initTest() {
        selectionCriteria = createEntity(em);
    }

    @Test
    @Transactional
    void createSelectionCriteria() throws Exception {
        int databaseSizeBeforeCreate = selectionCriteriaRepository.findAll().size();
        // Create the SelectionCriteria
        restSelectionCriteriaMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(selectionCriteria))
            )
            .andExpect(status().isCreated());

        // Validate the SelectionCriteria in the database
        List<SelectionCriteria> selectionCriteriaList = selectionCriteriaRepository.findAll();
        assertThat(selectionCriteriaList).hasSize(databaseSizeBeforeCreate + 1);
        SelectionCriteria testSelectionCriteria = selectionCriteriaList.get(selectionCriteriaList.size() - 1);
        assertThat(testSelectionCriteria.getCriterion()).isEqualTo(DEFAULT_CRITERION);
    }

    @Test
    @Transactional
    void createSelectionCriteriaWithExistingId() throws Exception {
        // Create the SelectionCriteria with an existing ID
        selectionCriteria.setId(1L);

        int databaseSizeBeforeCreate = selectionCriteriaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSelectionCriteriaMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(selectionCriteria))
            )
            .andExpect(status().isBadRequest());

        // Validate the SelectionCriteria in the database
        List<SelectionCriteria> selectionCriteriaList = selectionCriteriaRepository.findAll();
        assertThat(selectionCriteriaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSelectionCriteria() throws Exception {
        // Initialize the database
        selectionCriteriaRepository.saveAndFlush(selectionCriteria);

        // Get all the selectionCriteriaList
        restSelectionCriteriaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(selectionCriteria.getId().intValue())))
            .andExpect(jsonPath("$.[*].criterion").value(hasItem(DEFAULT_CRITERION.toString())));
    }

    @Test
    @Transactional
    void getSelectionCriteria() throws Exception {
        // Initialize the database
        selectionCriteriaRepository.saveAndFlush(selectionCriteria);

        // Get the selectionCriteria
        restSelectionCriteriaMockMvc
            .perform(get(ENTITY_API_URL_ID, selectionCriteria.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(selectionCriteria.getId().intValue()))
            .andExpect(jsonPath("$.criterion").value(DEFAULT_CRITERION.toString()));
    }

    @Test
    @Transactional
    void getNonExistingSelectionCriteria() throws Exception {
        // Get the selectionCriteria
        restSelectionCriteriaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSelectionCriteria() throws Exception {
        // Initialize the database
        selectionCriteriaRepository.saveAndFlush(selectionCriteria);

        int databaseSizeBeforeUpdate = selectionCriteriaRepository.findAll().size();

        // Update the selectionCriteria
        SelectionCriteria updatedSelectionCriteria = selectionCriteriaRepository.findById(selectionCriteria.getId()).get();
        // Disconnect from session so that the updates on updatedSelectionCriteria are not directly saved in db
        em.detach(updatedSelectionCriteria);
        updatedSelectionCriteria.criterion(UPDATED_CRITERION);

        restSelectionCriteriaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSelectionCriteria.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSelectionCriteria))
            )
            .andExpect(status().isOk());

        // Validate the SelectionCriteria in the database
        List<SelectionCriteria> selectionCriteriaList = selectionCriteriaRepository.findAll();
        assertThat(selectionCriteriaList).hasSize(databaseSizeBeforeUpdate);
        SelectionCriteria testSelectionCriteria = selectionCriteriaList.get(selectionCriteriaList.size() - 1);
        assertThat(testSelectionCriteria.getCriterion()).isEqualTo(UPDATED_CRITERION);
    }

    @Test
    @Transactional
    void putNonExistingSelectionCriteria() throws Exception {
        int databaseSizeBeforeUpdate = selectionCriteriaRepository.findAll().size();
        selectionCriteria.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSelectionCriteriaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, selectionCriteria.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(selectionCriteria))
            )
            .andExpect(status().isBadRequest());

        // Validate the SelectionCriteria in the database
        List<SelectionCriteria> selectionCriteriaList = selectionCriteriaRepository.findAll();
        assertThat(selectionCriteriaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSelectionCriteria() throws Exception {
        int databaseSizeBeforeUpdate = selectionCriteriaRepository.findAll().size();
        selectionCriteria.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSelectionCriteriaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(selectionCriteria))
            )
            .andExpect(status().isBadRequest());

        // Validate the SelectionCriteria in the database
        List<SelectionCriteria> selectionCriteriaList = selectionCriteriaRepository.findAll();
        assertThat(selectionCriteriaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSelectionCriteria() throws Exception {
        int databaseSizeBeforeUpdate = selectionCriteriaRepository.findAll().size();
        selectionCriteria.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSelectionCriteriaMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(selectionCriteria))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SelectionCriteria in the database
        List<SelectionCriteria> selectionCriteriaList = selectionCriteriaRepository.findAll();
        assertThat(selectionCriteriaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSelectionCriteriaWithPatch() throws Exception {
        // Initialize the database
        selectionCriteriaRepository.saveAndFlush(selectionCriteria);

        int databaseSizeBeforeUpdate = selectionCriteriaRepository.findAll().size();

        // Update the selectionCriteria using partial update
        SelectionCriteria partialUpdatedSelectionCriteria = new SelectionCriteria();
        partialUpdatedSelectionCriteria.setId(selectionCriteria.getId());

        partialUpdatedSelectionCriteria.criterion(UPDATED_CRITERION);

        restSelectionCriteriaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSelectionCriteria.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSelectionCriteria))
            )
            .andExpect(status().isOk());

        // Validate the SelectionCriteria in the database
        List<SelectionCriteria> selectionCriteriaList = selectionCriteriaRepository.findAll();
        assertThat(selectionCriteriaList).hasSize(databaseSizeBeforeUpdate);
        SelectionCriteria testSelectionCriteria = selectionCriteriaList.get(selectionCriteriaList.size() - 1);
        assertThat(testSelectionCriteria.getCriterion()).isEqualTo(UPDATED_CRITERION);
    }

    @Test
    @Transactional
    void fullUpdateSelectionCriteriaWithPatch() throws Exception {
        // Initialize the database
        selectionCriteriaRepository.saveAndFlush(selectionCriteria);

        int databaseSizeBeforeUpdate = selectionCriteriaRepository.findAll().size();

        // Update the selectionCriteria using partial update
        SelectionCriteria partialUpdatedSelectionCriteria = new SelectionCriteria();
        partialUpdatedSelectionCriteria.setId(selectionCriteria.getId());

        partialUpdatedSelectionCriteria.criterion(UPDATED_CRITERION);

        restSelectionCriteriaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSelectionCriteria.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSelectionCriteria))
            )
            .andExpect(status().isOk());

        // Validate the SelectionCriteria in the database
        List<SelectionCriteria> selectionCriteriaList = selectionCriteriaRepository.findAll();
        assertThat(selectionCriteriaList).hasSize(databaseSizeBeforeUpdate);
        SelectionCriteria testSelectionCriteria = selectionCriteriaList.get(selectionCriteriaList.size() - 1);
        assertThat(testSelectionCriteria.getCriterion()).isEqualTo(UPDATED_CRITERION);
    }

    @Test
    @Transactional
    void patchNonExistingSelectionCriteria() throws Exception {
        int databaseSizeBeforeUpdate = selectionCriteriaRepository.findAll().size();
        selectionCriteria.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSelectionCriteriaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, selectionCriteria.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(selectionCriteria))
            )
            .andExpect(status().isBadRequest());

        // Validate the SelectionCriteria in the database
        List<SelectionCriteria> selectionCriteriaList = selectionCriteriaRepository.findAll();
        assertThat(selectionCriteriaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSelectionCriteria() throws Exception {
        int databaseSizeBeforeUpdate = selectionCriteriaRepository.findAll().size();
        selectionCriteria.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSelectionCriteriaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(selectionCriteria))
            )
            .andExpect(status().isBadRequest());

        // Validate the SelectionCriteria in the database
        List<SelectionCriteria> selectionCriteriaList = selectionCriteriaRepository.findAll();
        assertThat(selectionCriteriaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSelectionCriteria() throws Exception {
        int databaseSizeBeforeUpdate = selectionCriteriaRepository.findAll().size();
        selectionCriteria.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSelectionCriteriaMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(selectionCriteria))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SelectionCriteria in the database
        List<SelectionCriteria> selectionCriteriaList = selectionCriteriaRepository.findAll();
        assertThat(selectionCriteriaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSelectionCriteria() throws Exception {
        // Initialize the database
        selectionCriteriaRepository.saveAndFlush(selectionCriteria);

        int databaseSizeBeforeDelete = selectionCriteriaRepository.findAll().size();

        // Delete the selectionCriteria
        restSelectionCriteriaMockMvc
            .perform(delete(ENTITY_API_URL_ID, selectionCriteria.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SelectionCriteria> selectionCriteriaList = selectionCriteriaRepository.findAll();
        assertThat(selectionCriteriaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
