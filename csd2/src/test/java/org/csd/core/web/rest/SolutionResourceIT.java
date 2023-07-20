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
import org.csd.core.domain.Solution;
import org.csd.core.repository.SolutionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SolutionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SolutionResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/solutions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SolutionRepository solutionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSolutionMockMvc;

    private Solution solution;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Solution createEntity(EntityManager em) {
        Solution solution = new Solution().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION);
        return solution;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Solution createUpdatedEntity(EntityManager em) {
        Solution solution = new Solution().name(UPDATED_NAME).description(UPDATED_DESCRIPTION);
        return solution;
    }

    @BeforeEach
    public void initTest() {
        solution = createEntity(em);
    }

    @Test
    @Transactional
    void createSolution() throws Exception {
        int databaseSizeBeforeCreate = solutionRepository.findAll().size();
        // Create the Solution
        restSolutionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(solution)))
            .andExpect(status().isCreated());

        // Validate the Solution in the database
        List<Solution> solutionList = solutionRepository.findAll();
        assertThat(solutionList).hasSize(databaseSizeBeforeCreate + 1);
        Solution testSolution = solutionList.get(solutionList.size() - 1);
        assertThat(testSolution.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSolution.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createSolutionWithExistingId() throws Exception {
        // Create the Solution with an existing ID
        solution.setId(1L);

        int databaseSizeBeforeCreate = solutionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSolutionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(solution)))
            .andExpect(status().isBadRequest());

        // Validate the Solution in the database
        List<Solution> solutionList = solutionRepository.findAll();
        assertThat(solutionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSolutions() throws Exception {
        // Initialize the database
        solutionRepository.saveAndFlush(solution);

        // Get all the solutionList
        restSolutionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(solution.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getSolution() throws Exception {
        // Initialize the database
        solutionRepository.saveAndFlush(solution);

        // Get the solution
        restSolutionMockMvc
            .perform(get(ENTITY_API_URL_ID, solution.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(solution.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingSolution() throws Exception {
        // Get the solution
        restSolutionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSolution() throws Exception {
        // Initialize the database
        solutionRepository.saveAndFlush(solution);

        int databaseSizeBeforeUpdate = solutionRepository.findAll().size();

        // Update the solution
        Solution updatedSolution = solutionRepository.findById(solution.getId()).get();
        // Disconnect from session so that the updates on updatedSolution are not directly saved in db
        em.detach(updatedSolution);
        updatedSolution.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restSolutionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSolution.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSolution))
            )
            .andExpect(status().isOk());

        // Validate the Solution in the database
        List<Solution> solutionList = solutionRepository.findAll();
        assertThat(solutionList).hasSize(databaseSizeBeforeUpdate);
        Solution testSolution = solutionList.get(solutionList.size() - 1);
        assertThat(testSolution.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSolution.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingSolution() throws Exception {
        int databaseSizeBeforeUpdate = solutionRepository.findAll().size();
        solution.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSolutionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, solution.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(solution))
            )
            .andExpect(status().isBadRequest());

        // Validate the Solution in the database
        List<Solution> solutionList = solutionRepository.findAll();
        assertThat(solutionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSolution() throws Exception {
        int databaseSizeBeforeUpdate = solutionRepository.findAll().size();
        solution.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSolutionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(solution))
            )
            .andExpect(status().isBadRequest());

        // Validate the Solution in the database
        List<Solution> solutionList = solutionRepository.findAll();
        assertThat(solutionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSolution() throws Exception {
        int databaseSizeBeforeUpdate = solutionRepository.findAll().size();
        solution.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSolutionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(solution)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Solution in the database
        List<Solution> solutionList = solutionRepository.findAll();
        assertThat(solutionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSolutionWithPatch() throws Exception {
        // Initialize the database
        solutionRepository.saveAndFlush(solution);

        int databaseSizeBeforeUpdate = solutionRepository.findAll().size();

        // Update the solution using partial update
        Solution partialUpdatedSolution = new Solution();
        partialUpdatedSolution.setId(solution.getId());

        partialUpdatedSolution.name(UPDATED_NAME);

        restSolutionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSolution.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSolution))
            )
            .andExpect(status().isOk());

        // Validate the Solution in the database
        List<Solution> solutionList = solutionRepository.findAll();
        assertThat(solutionList).hasSize(databaseSizeBeforeUpdate);
        Solution testSolution = solutionList.get(solutionList.size() - 1);
        assertThat(testSolution.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSolution.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateSolutionWithPatch() throws Exception {
        // Initialize the database
        solutionRepository.saveAndFlush(solution);

        int databaseSizeBeforeUpdate = solutionRepository.findAll().size();

        // Update the solution using partial update
        Solution partialUpdatedSolution = new Solution();
        partialUpdatedSolution.setId(solution.getId());

        partialUpdatedSolution.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restSolutionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSolution.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSolution))
            )
            .andExpect(status().isOk());

        // Validate the Solution in the database
        List<Solution> solutionList = solutionRepository.findAll();
        assertThat(solutionList).hasSize(databaseSizeBeforeUpdate);
        Solution testSolution = solutionList.get(solutionList.size() - 1);
        assertThat(testSolution.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSolution.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingSolution() throws Exception {
        int databaseSizeBeforeUpdate = solutionRepository.findAll().size();
        solution.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSolutionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, solution.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(solution))
            )
            .andExpect(status().isBadRequest());

        // Validate the Solution in the database
        List<Solution> solutionList = solutionRepository.findAll();
        assertThat(solutionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSolution() throws Exception {
        int databaseSizeBeforeUpdate = solutionRepository.findAll().size();
        solution.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSolutionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(solution))
            )
            .andExpect(status().isBadRequest());

        // Validate the Solution in the database
        List<Solution> solutionList = solutionRepository.findAll();
        assertThat(solutionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSolution() throws Exception {
        int databaseSizeBeforeUpdate = solutionRepository.findAll().size();
        solution.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSolutionMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(solution)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Solution in the database
        List<Solution> solutionList = solutionRepository.findAll();
        assertThat(solutionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSolution() throws Exception {
        // Initialize the database
        solutionRepository.saveAndFlush(solution);

        int databaseSizeBeforeDelete = solutionRepository.findAll().size();

        // Delete the solution
        restSolutionMockMvc
            .perform(delete(ENTITY_API_URL_ID, solution.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Solution> solutionList = solutionRepository.findAll();
        assertThat(solutionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
