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
import org.csd.core.domain.Knowuse;
import org.csd.core.repository.KnowuseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link KnowuseResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class KnowuseResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/knowuses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private KnowuseRepository knowuseRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restKnowuseMockMvc;

    private Knowuse knowuse;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Knowuse createEntity(EntityManager em) {
        Knowuse knowuse = new Knowuse().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION);
        return knowuse;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Knowuse createUpdatedEntity(EntityManager em) {
        Knowuse knowuse = new Knowuse().name(UPDATED_NAME).description(UPDATED_DESCRIPTION);
        return knowuse;
    }

    @BeforeEach
    public void initTest() {
        knowuse = createEntity(em);
    }

    @Test
    @Transactional
    void createKnowuse() throws Exception {
        int databaseSizeBeforeCreate = knowuseRepository.findAll().size();
        // Create the Knowuse
        restKnowuseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(knowuse)))
            .andExpect(status().isCreated());

        // Validate the Knowuse in the database
        List<Knowuse> knowuseList = knowuseRepository.findAll();
        assertThat(knowuseList).hasSize(databaseSizeBeforeCreate + 1);
        Knowuse testKnowuse = knowuseList.get(knowuseList.size() - 1);
        assertThat(testKnowuse.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testKnowuse.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createKnowuseWithExistingId() throws Exception {
        // Create the Knowuse with an existing ID
        knowuse.setId(1L);

        int databaseSizeBeforeCreate = knowuseRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restKnowuseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(knowuse)))
            .andExpect(status().isBadRequest());

        // Validate the Knowuse in the database
        List<Knowuse> knowuseList = knowuseRepository.findAll();
        assertThat(knowuseList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllKnowuses() throws Exception {
        // Initialize the database
        knowuseRepository.saveAndFlush(knowuse);

        // Get all the knowuseList
        restKnowuseMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(knowuse.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getKnowuse() throws Exception {
        // Initialize the database
        knowuseRepository.saveAndFlush(knowuse);

        // Get the knowuse
        restKnowuseMockMvc
            .perform(get(ENTITY_API_URL_ID, knowuse.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(knowuse.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingKnowuse() throws Exception {
        // Get the knowuse
        restKnowuseMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingKnowuse() throws Exception {
        // Initialize the database
        knowuseRepository.saveAndFlush(knowuse);

        int databaseSizeBeforeUpdate = knowuseRepository.findAll().size();

        // Update the knowuse
        Knowuse updatedKnowuse = knowuseRepository.findById(knowuse.getId()).get();
        // Disconnect from session so that the updates on updatedKnowuse are not directly saved in db
        em.detach(updatedKnowuse);
        updatedKnowuse.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restKnowuseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedKnowuse.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedKnowuse))
            )
            .andExpect(status().isOk());

        // Validate the Knowuse in the database
        List<Knowuse> knowuseList = knowuseRepository.findAll();
        assertThat(knowuseList).hasSize(databaseSizeBeforeUpdate);
        Knowuse testKnowuse = knowuseList.get(knowuseList.size() - 1);
        assertThat(testKnowuse.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testKnowuse.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingKnowuse() throws Exception {
        int databaseSizeBeforeUpdate = knowuseRepository.findAll().size();
        knowuse.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKnowuseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, knowuse.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(knowuse))
            )
            .andExpect(status().isBadRequest());

        // Validate the Knowuse in the database
        List<Knowuse> knowuseList = knowuseRepository.findAll();
        assertThat(knowuseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchKnowuse() throws Exception {
        int databaseSizeBeforeUpdate = knowuseRepository.findAll().size();
        knowuse.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKnowuseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(knowuse))
            )
            .andExpect(status().isBadRequest());

        // Validate the Knowuse in the database
        List<Knowuse> knowuseList = knowuseRepository.findAll();
        assertThat(knowuseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamKnowuse() throws Exception {
        int databaseSizeBeforeUpdate = knowuseRepository.findAll().size();
        knowuse.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKnowuseMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(knowuse)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Knowuse in the database
        List<Knowuse> knowuseList = knowuseRepository.findAll();
        assertThat(knowuseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateKnowuseWithPatch() throws Exception {
        // Initialize the database
        knowuseRepository.saveAndFlush(knowuse);

        int databaseSizeBeforeUpdate = knowuseRepository.findAll().size();

        // Update the knowuse using partial update
        Knowuse partialUpdatedKnowuse = new Knowuse();
        partialUpdatedKnowuse.setId(knowuse.getId());

        partialUpdatedKnowuse.description(UPDATED_DESCRIPTION);

        restKnowuseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKnowuse.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedKnowuse))
            )
            .andExpect(status().isOk());

        // Validate the Knowuse in the database
        List<Knowuse> knowuseList = knowuseRepository.findAll();
        assertThat(knowuseList).hasSize(databaseSizeBeforeUpdate);
        Knowuse testKnowuse = knowuseList.get(knowuseList.size() - 1);
        assertThat(testKnowuse.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testKnowuse.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateKnowuseWithPatch() throws Exception {
        // Initialize the database
        knowuseRepository.saveAndFlush(knowuse);

        int databaseSizeBeforeUpdate = knowuseRepository.findAll().size();

        // Update the knowuse using partial update
        Knowuse partialUpdatedKnowuse = new Knowuse();
        partialUpdatedKnowuse.setId(knowuse.getId());

        partialUpdatedKnowuse.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restKnowuseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKnowuse.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedKnowuse))
            )
            .andExpect(status().isOk());

        // Validate the Knowuse in the database
        List<Knowuse> knowuseList = knowuseRepository.findAll();
        assertThat(knowuseList).hasSize(databaseSizeBeforeUpdate);
        Knowuse testKnowuse = knowuseList.get(knowuseList.size() - 1);
        assertThat(testKnowuse.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testKnowuse.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingKnowuse() throws Exception {
        int databaseSizeBeforeUpdate = knowuseRepository.findAll().size();
        knowuse.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKnowuseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, knowuse.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(knowuse))
            )
            .andExpect(status().isBadRequest());

        // Validate the Knowuse in the database
        List<Knowuse> knowuseList = knowuseRepository.findAll();
        assertThat(knowuseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchKnowuse() throws Exception {
        int databaseSizeBeforeUpdate = knowuseRepository.findAll().size();
        knowuse.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKnowuseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(knowuse))
            )
            .andExpect(status().isBadRequest());

        // Validate the Knowuse in the database
        List<Knowuse> knowuseList = knowuseRepository.findAll();
        assertThat(knowuseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamKnowuse() throws Exception {
        int databaseSizeBeforeUpdate = knowuseRepository.findAll().size();
        knowuse.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKnowuseMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(knowuse)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Knowuse in the database
        List<Knowuse> knowuseList = knowuseRepository.findAll();
        assertThat(knowuseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteKnowuse() throws Exception {
        // Initialize the database
        knowuseRepository.saveAndFlush(knowuse);

        int databaseSizeBeforeDelete = knowuseRepository.findAll().size();

        // Delete the knowuse
        restKnowuseMockMvc
            .perform(delete(ENTITY_API_URL_ID, knowuse.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Knowuse> knowuseList = knowuseRepository.findAll();
        assertThat(knowuseList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
