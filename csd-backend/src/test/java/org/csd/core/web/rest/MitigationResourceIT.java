package org.csd.core.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.csd.core.IntegrationTest;
import org.csd.core.domain.Mitigation;
import org.csd.core.domain.Vulnerability;
import org.csd.core.repository.MitigationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MitigationResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class MitigationResourceIT {

    private static final String ENTITY_API_URL = "/api/mitigations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MitigationRepository mitigationRepository;

    @Mock
    private MitigationRepository mitigationRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMitigationMockMvc;

    private Mitigation mitigation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mitigation createEntity(EntityManager em) {
        Mitigation mitigation = new Mitigation();
        // Add required entity
        Vulnerability vulnerability;
        if (TestUtil.findAll(em, Vulnerability.class).isEmpty()) {
            vulnerability = VulnerabilityResourceIT.createEntity(em);
            em.persist(vulnerability);
            em.flush();
        } else {
            vulnerability = TestUtil.findAll(em, Vulnerability.class).get(0);
        }
        mitigation.getVulnerabilities().add(vulnerability);
        return mitigation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mitigation createUpdatedEntity(EntityManager em) {
        Mitigation mitigation = new Mitigation();
        // Add required entity
        Vulnerability vulnerability;
        if (TestUtil.findAll(em, Vulnerability.class).isEmpty()) {
            vulnerability = VulnerabilityResourceIT.createUpdatedEntity(em);
            em.persist(vulnerability);
            em.flush();
        } else {
            vulnerability = TestUtil.findAll(em, Vulnerability.class).get(0);
        }
        mitigation.getVulnerabilities().add(vulnerability);
        return mitigation;
    }

    @BeforeEach
    public void initTest() {
        mitigation = createEntity(em);
    }

    @Test
    @Transactional
    void createMitigation() throws Exception {
        int databaseSizeBeforeCreate = mitigationRepository.findAll().size();
        // Create the Mitigation
        restMitigationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mitigation)))
            .andExpect(status().isCreated());

        // Validate the Mitigation in the database
        List<Mitigation> mitigationList = mitigationRepository.findAll();
        assertThat(mitigationList).hasSize(databaseSizeBeforeCreate + 1);
        Mitigation testMitigation = mitigationList.get(mitigationList.size() - 1);
    }

    @Test
    @Transactional
    void createMitigationWithExistingId() throws Exception {
        // Create the Mitigation with an existing ID
        mitigation.setId(1L);

        int databaseSizeBeforeCreate = mitigationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMitigationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mitigation)))
            .andExpect(status().isBadRequest());

        // Validate the Mitigation in the database
        List<Mitigation> mitigationList = mitigationRepository.findAll();
        assertThat(mitigationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMitigations() throws Exception {
        // Initialize the database
        mitigationRepository.saveAndFlush(mitigation);

        // Get all the mitigationList
        restMitigationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mitigation.getId().intValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMitigationsWithEagerRelationshipsIsEnabled() throws Exception {
        when(mitigationRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMitigationMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(mitigationRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMitigationsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(mitigationRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMitigationMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(mitigationRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getMitigation() throws Exception {
        // Initialize the database
        mitigationRepository.saveAndFlush(mitigation);

        // Get the mitigation
        restMitigationMockMvc
            .perform(get(ENTITY_API_URL_ID, mitigation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mitigation.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingMitigation() throws Exception {
        // Get the mitigation
        restMitigationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMitigation() throws Exception {
        // Initialize the database
        mitigationRepository.saveAndFlush(mitigation);

        int databaseSizeBeforeUpdate = mitigationRepository.findAll().size();

        // Update the mitigation
        Mitigation updatedMitigation = mitigationRepository.findById(mitigation.getId()).get();
        // Disconnect from session so that the updates on updatedMitigation are not directly saved in db
        em.detach(updatedMitigation);

        restMitigationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMitigation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMitigation))
            )
            .andExpect(status().isOk());

        // Validate the Mitigation in the database
        List<Mitigation> mitigationList = mitigationRepository.findAll();
        assertThat(mitigationList).hasSize(databaseSizeBeforeUpdate);
        Mitigation testMitigation = mitigationList.get(mitigationList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingMitigation() throws Exception {
        int databaseSizeBeforeUpdate = mitigationRepository.findAll().size();
        mitigation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMitigationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mitigation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mitigation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mitigation in the database
        List<Mitigation> mitigationList = mitigationRepository.findAll();
        assertThat(mitigationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMitigation() throws Exception {
        int databaseSizeBeforeUpdate = mitigationRepository.findAll().size();
        mitigation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMitigationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mitigation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mitigation in the database
        List<Mitigation> mitigationList = mitigationRepository.findAll();
        assertThat(mitigationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMitigation() throws Exception {
        int databaseSizeBeforeUpdate = mitigationRepository.findAll().size();
        mitigation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMitigationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mitigation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Mitigation in the database
        List<Mitigation> mitigationList = mitigationRepository.findAll();
        assertThat(mitigationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMitigationWithPatch() throws Exception {
        // Initialize the database
        mitigationRepository.saveAndFlush(mitigation);

        int databaseSizeBeforeUpdate = mitigationRepository.findAll().size();

        // Update the mitigation using partial update
        Mitigation partialUpdatedMitigation = new Mitigation();
        partialUpdatedMitigation.setId(mitigation.getId());

        restMitigationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMitigation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMitigation))
            )
            .andExpect(status().isOk());

        // Validate the Mitigation in the database
        List<Mitigation> mitigationList = mitigationRepository.findAll();
        assertThat(mitigationList).hasSize(databaseSizeBeforeUpdate);
        Mitigation testMitigation = mitigationList.get(mitigationList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateMitigationWithPatch() throws Exception {
        // Initialize the database
        mitigationRepository.saveAndFlush(mitigation);

        int databaseSizeBeforeUpdate = mitigationRepository.findAll().size();

        // Update the mitigation using partial update
        Mitigation partialUpdatedMitigation = new Mitigation();
        partialUpdatedMitigation.setId(mitigation.getId());

        restMitigationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMitigation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMitigation))
            )
            .andExpect(status().isOk());

        // Validate the Mitigation in the database
        List<Mitigation> mitigationList = mitigationRepository.findAll();
        assertThat(mitigationList).hasSize(databaseSizeBeforeUpdate);
        Mitigation testMitigation = mitigationList.get(mitigationList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingMitigation() throws Exception {
        int databaseSizeBeforeUpdate = mitigationRepository.findAll().size();
        mitigation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMitigationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, mitigation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mitigation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mitigation in the database
        List<Mitigation> mitigationList = mitigationRepository.findAll();
        assertThat(mitigationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMitigation() throws Exception {
        int databaseSizeBeforeUpdate = mitigationRepository.findAll().size();
        mitigation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMitigationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mitigation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mitigation in the database
        List<Mitigation> mitigationList = mitigationRepository.findAll();
        assertThat(mitigationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMitigation() throws Exception {
        int databaseSizeBeforeUpdate = mitigationRepository.findAll().size();
        mitigation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMitigationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(mitigation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Mitigation in the database
        List<Mitigation> mitigationList = mitigationRepository.findAll();
        assertThat(mitigationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMitigation() throws Exception {
        // Initialize the database
        mitigationRepository.saveAndFlush(mitigation);

        int databaseSizeBeforeDelete = mitigationRepository.findAll().size();

        // Delete the mitigation
        restMitigationMockMvc
            .perform(delete(ENTITY_API_URL_ID, mitigation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Mitigation> mitigationList = mitigationRepository.findAll();
        assertThat(mitigationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
