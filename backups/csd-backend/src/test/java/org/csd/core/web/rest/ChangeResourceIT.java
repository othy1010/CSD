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
import org.csd.core.domain.Change;
import org.csd.core.domain.enumeration.ChangeType;
import org.csd.core.repository.ChangeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ChangeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ChangeResourceIT {

    private static final ChangeType DEFAULT_TYPE = ChangeType.ADDEDELT;
    private static final ChangeType UPDATED_TYPE = ChangeType.DELETEDELT;

    private static final String DEFAULT_REF_ID = "AAAAAAAAAA";
    private static final String UPDATED_REF_ID = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/changes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChangeRepository changeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChangeMockMvc;

    private Change change;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Change createEntity(EntityManager em) {
        Change change = new Change().type(DEFAULT_TYPE).refId(DEFAULT_REF_ID);
        return change;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Change createUpdatedEntity(EntityManager em) {
        Change change = new Change().type(UPDATED_TYPE).refId(UPDATED_REF_ID);
        return change;
    }

    @BeforeEach
    public void initTest() {
        change = createEntity(em);
    }

    @Test
    @Transactional
    void createChange() throws Exception {
        int databaseSizeBeforeCreate = changeRepository.findAll().size();
        // Create the Change
        restChangeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(change)))
            .andExpect(status().isCreated());

        // Validate the Change in the database
        List<Change> changeList = changeRepository.findAll();
        assertThat(changeList).hasSize(databaseSizeBeforeCreate + 1);
        Change testChange = changeList.get(changeList.size() - 1);
        assertThat(testChange.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testChange.getRefId()).isEqualTo(DEFAULT_REF_ID);
    }

    @Test
    @Transactional
    void createChangeWithExistingId() throws Exception {
        // Create the Change with an existing ID
        change.setId(1L);

        int databaseSizeBeforeCreate = changeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChangeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(change)))
            .andExpect(status().isBadRequest());

        // Validate the Change in the database
        List<Change> changeList = changeRepository.findAll();
        assertThat(changeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllChanges() throws Exception {
        // Initialize the database
        changeRepository.saveAndFlush(change);

        // Get all the changeList
        restChangeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(change.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].refId").value(hasItem(DEFAULT_REF_ID)));
    }

    @Test
    @Transactional
    void getChange() throws Exception {
        // Initialize the database
        changeRepository.saveAndFlush(change);

        // Get the change
        restChangeMockMvc
            .perform(get(ENTITY_API_URL_ID, change.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(change.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.refId").value(DEFAULT_REF_ID));
    }

    @Test
    @Transactional
    void getNonExistingChange() throws Exception {
        // Get the change
        restChangeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingChange() throws Exception {
        // Initialize the database
        changeRepository.saveAndFlush(change);

        int databaseSizeBeforeUpdate = changeRepository.findAll().size();

        // Update the change
        Change updatedChange = changeRepository.findById(change.getId()).get();
        // Disconnect from session so that the updates on updatedChange are not directly saved in db
        em.detach(updatedChange);
        updatedChange.type(UPDATED_TYPE).refId(UPDATED_REF_ID);

        restChangeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChange.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChange))
            )
            .andExpect(status().isOk());

        // Validate the Change in the database
        List<Change> changeList = changeRepository.findAll();
        assertThat(changeList).hasSize(databaseSizeBeforeUpdate);
        Change testChange = changeList.get(changeList.size() - 1);
        assertThat(testChange.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testChange.getRefId()).isEqualTo(UPDATED_REF_ID);
    }

    @Test
    @Transactional
    void putNonExistingChange() throws Exception {
        int databaseSizeBeforeUpdate = changeRepository.findAll().size();
        change.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChangeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, change.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(change))
            )
            .andExpect(status().isBadRequest());

        // Validate the Change in the database
        List<Change> changeList = changeRepository.findAll();
        assertThat(changeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChange() throws Exception {
        int databaseSizeBeforeUpdate = changeRepository.findAll().size();
        change.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChangeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(change))
            )
            .andExpect(status().isBadRequest());

        // Validate the Change in the database
        List<Change> changeList = changeRepository.findAll();
        assertThat(changeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChange() throws Exception {
        int databaseSizeBeforeUpdate = changeRepository.findAll().size();
        change.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChangeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(change)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Change in the database
        List<Change> changeList = changeRepository.findAll();
        assertThat(changeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChangeWithPatch() throws Exception {
        // Initialize the database
        changeRepository.saveAndFlush(change);

        int databaseSizeBeforeUpdate = changeRepository.findAll().size();

        // Update the change using partial update
        Change partialUpdatedChange = new Change();
        partialUpdatedChange.setId(change.getId());

        restChangeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChange.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChange))
            )
            .andExpect(status().isOk());

        // Validate the Change in the database
        List<Change> changeList = changeRepository.findAll();
        assertThat(changeList).hasSize(databaseSizeBeforeUpdate);
        Change testChange = changeList.get(changeList.size() - 1);
        assertThat(testChange.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testChange.getRefId()).isEqualTo(DEFAULT_REF_ID);
    }

    @Test
    @Transactional
    void fullUpdateChangeWithPatch() throws Exception {
        // Initialize the database
        changeRepository.saveAndFlush(change);

        int databaseSizeBeforeUpdate = changeRepository.findAll().size();

        // Update the change using partial update
        Change partialUpdatedChange = new Change();
        partialUpdatedChange.setId(change.getId());

        partialUpdatedChange.type(UPDATED_TYPE).refId(UPDATED_REF_ID);

        restChangeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChange.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChange))
            )
            .andExpect(status().isOk());

        // Validate the Change in the database
        List<Change> changeList = changeRepository.findAll();
        assertThat(changeList).hasSize(databaseSizeBeforeUpdate);
        Change testChange = changeList.get(changeList.size() - 1);
        assertThat(testChange.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testChange.getRefId()).isEqualTo(UPDATED_REF_ID);
    }

    @Test
    @Transactional
    void patchNonExistingChange() throws Exception {
        int databaseSizeBeforeUpdate = changeRepository.findAll().size();
        change.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChangeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, change.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(change))
            )
            .andExpect(status().isBadRequest());

        // Validate the Change in the database
        List<Change> changeList = changeRepository.findAll();
        assertThat(changeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChange() throws Exception {
        int databaseSizeBeforeUpdate = changeRepository.findAll().size();
        change.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChangeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(change))
            )
            .andExpect(status().isBadRequest());

        // Validate the Change in the database
        List<Change> changeList = changeRepository.findAll();
        assertThat(changeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChange() throws Exception {
        int databaseSizeBeforeUpdate = changeRepository.findAll().size();
        change.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChangeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(change)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Change in the database
        List<Change> changeList = changeRepository.findAll();
        assertThat(changeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChange() throws Exception {
        // Initialize the database
        changeRepository.saveAndFlush(change);

        int databaseSizeBeforeDelete = changeRepository.findAll().size();

        // Delete the change
        restChangeMockMvc
            .perform(delete(ENTITY_API_URL_ID, change.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Change> changeList = changeRepository.findAll();
        assertThat(changeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
