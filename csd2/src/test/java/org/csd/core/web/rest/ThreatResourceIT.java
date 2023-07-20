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
import org.csd.core.domain.Threat;
import org.csd.core.domain.enumeration.ThreatReference;
import org.csd.core.repository.ThreatRepository;
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
 * Integration tests for the {@link ThreatResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ThreatResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Integer DEFAULT_PROBABILITY = 1;
    private static final Integer UPDATED_PROBABILITY = 2;

    private static final ThreatReference DEFAULT_REFERENCE = ThreatReference.CAPEC;
    private static final ThreatReference UPDATED_REFERENCE = ThreatReference.ATTACK;

    private static final String DEFAULT_REF_ID = "AAAAAAAAAA";
    private static final String UPDATED_REF_ID = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/threats";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ThreatRepository threatRepository;

    @Mock
    private ThreatRepository threatRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restThreatMockMvc;

    private Threat threat;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Threat createEntity(EntityManager em) {
        Threat threat = new Threat()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .probability(DEFAULT_PROBABILITY)
            .reference(DEFAULT_REFERENCE)
            .refId(DEFAULT_REF_ID);
        return threat;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Threat createUpdatedEntity(EntityManager em) {
        Threat threat = new Threat()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .probability(UPDATED_PROBABILITY)
            .reference(UPDATED_REFERENCE)
            .refId(UPDATED_REF_ID);
        return threat;
    }

    @BeforeEach
    public void initTest() {
        threat = createEntity(em);
    }

    @Test
    @Transactional
    void createThreat() throws Exception {
        int databaseSizeBeforeCreate = threatRepository.findAll().size();
        // Create the Threat
        restThreatMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(threat)))
            .andExpect(status().isCreated());

        // Validate the Threat in the database
        List<Threat> threatList = threatRepository.findAll();
        assertThat(threatList).hasSize(databaseSizeBeforeCreate + 1);
        Threat testThreat = threatList.get(threatList.size() - 1);
        assertThat(testThreat.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testThreat.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testThreat.getProbability()).isEqualTo(DEFAULT_PROBABILITY);
        assertThat(testThreat.getReference()).isEqualTo(DEFAULT_REFERENCE);
        assertThat(testThreat.getRefId()).isEqualTo(DEFAULT_REF_ID);
    }

    @Test
    @Transactional
    void createThreatWithExistingId() throws Exception {
        // Create the Threat with an existing ID
        threat.setId(1L);

        int databaseSizeBeforeCreate = threatRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restThreatMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(threat)))
            .andExpect(status().isBadRequest());

        // Validate the Threat in the database
        List<Threat> threatList = threatRepository.findAll();
        assertThat(threatList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllThreats() throws Exception {
        // Initialize the database
        threatRepository.saveAndFlush(threat);

        // Get all the threatList
        restThreatMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(threat.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].probability").value(hasItem(DEFAULT_PROBABILITY)))
            .andExpect(jsonPath("$.[*].reference").value(hasItem(DEFAULT_REFERENCE.toString())))
            .andExpect(jsonPath("$.[*].refId").value(hasItem(DEFAULT_REF_ID)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllThreatsWithEagerRelationshipsIsEnabled() throws Exception {
        when(threatRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restThreatMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(threatRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllThreatsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(threatRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restThreatMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(threatRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getThreat() throws Exception {
        // Initialize the database
        threatRepository.saveAndFlush(threat);

        // Get the threat
        restThreatMockMvc
            .perform(get(ENTITY_API_URL_ID, threat.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(threat.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.probability").value(DEFAULT_PROBABILITY))
            .andExpect(jsonPath("$.reference").value(DEFAULT_REFERENCE.toString()))
            .andExpect(jsonPath("$.refId").value(DEFAULT_REF_ID));
    }

    @Test
    @Transactional
    void getNonExistingThreat() throws Exception {
        // Get the threat
        restThreatMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingThreat() throws Exception {
        // Initialize the database
        threatRepository.saveAndFlush(threat);

        int databaseSizeBeforeUpdate = threatRepository.findAll().size();

        // Update the threat
        Threat updatedThreat = threatRepository.findById(threat.getId()).get();
        // Disconnect from session so that the updates on updatedThreat are not directly saved in db
        em.detach(updatedThreat);
        updatedThreat
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .probability(UPDATED_PROBABILITY)
            .reference(UPDATED_REFERENCE)
            .refId(UPDATED_REF_ID);

        restThreatMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedThreat.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedThreat))
            )
            .andExpect(status().isOk());

        // Validate the Threat in the database
        List<Threat> threatList = threatRepository.findAll();
        assertThat(threatList).hasSize(databaseSizeBeforeUpdate);
        Threat testThreat = threatList.get(threatList.size() - 1);
        assertThat(testThreat.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testThreat.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testThreat.getProbability()).isEqualTo(UPDATED_PROBABILITY);
        assertThat(testThreat.getReference()).isEqualTo(UPDATED_REFERENCE);
        assertThat(testThreat.getRefId()).isEqualTo(UPDATED_REF_ID);
    }

    @Test
    @Transactional
    void putNonExistingThreat() throws Exception {
        int databaseSizeBeforeUpdate = threatRepository.findAll().size();
        threat.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restThreatMockMvc
            .perform(
                put(ENTITY_API_URL_ID, threat.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(threat))
            )
            .andExpect(status().isBadRequest());

        // Validate the Threat in the database
        List<Threat> threatList = threatRepository.findAll();
        assertThat(threatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchThreat() throws Exception {
        int databaseSizeBeforeUpdate = threatRepository.findAll().size();
        threat.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restThreatMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(threat))
            )
            .andExpect(status().isBadRequest());

        // Validate the Threat in the database
        List<Threat> threatList = threatRepository.findAll();
        assertThat(threatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamThreat() throws Exception {
        int databaseSizeBeforeUpdate = threatRepository.findAll().size();
        threat.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restThreatMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(threat)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Threat in the database
        List<Threat> threatList = threatRepository.findAll();
        assertThat(threatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateThreatWithPatch() throws Exception {
        // Initialize the database
        threatRepository.saveAndFlush(threat);

        int databaseSizeBeforeUpdate = threatRepository.findAll().size();

        // Update the threat using partial update
        Threat partialUpdatedThreat = new Threat();
        partialUpdatedThreat.setId(threat.getId());

        partialUpdatedThreat.description(UPDATED_DESCRIPTION).probability(UPDATED_PROBABILITY).reference(UPDATED_REFERENCE);

        restThreatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedThreat.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedThreat))
            )
            .andExpect(status().isOk());

        // Validate the Threat in the database
        List<Threat> threatList = threatRepository.findAll();
        assertThat(threatList).hasSize(databaseSizeBeforeUpdate);
        Threat testThreat = threatList.get(threatList.size() - 1);
        assertThat(testThreat.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testThreat.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testThreat.getProbability()).isEqualTo(UPDATED_PROBABILITY);
        assertThat(testThreat.getReference()).isEqualTo(UPDATED_REFERENCE);
        assertThat(testThreat.getRefId()).isEqualTo(DEFAULT_REF_ID);
    }

    @Test
    @Transactional
    void fullUpdateThreatWithPatch() throws Exception {
        // Initialize the database
        threatRepository.saveAndFlush(threat);

        int databaseSizeBeforeUpdate = threatRepository.findAll().size();

        // Update the threat using partial update
        Threat partialUpdatedThreat = new Threat();
        partialUpdatedThreat.setId(threat.getId());

        partialUpdatedThreat
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .probability(UPDATED_PROBABILITY)
            .reference(UPDATED_REFERENCE)
            .refId(UPDATED_REF_ID);

        restThreatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedThreat.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedThreat))
            )
            .andExpect(status().isOk());

        // Validate the Threat in the database
        List<Threat> threatList = threatRepository.findAll();
        assertThat(threatList).hasSize(databaseSizeBeforeUpdate);
        Threat testThreat = threatList.get(threatList.size() - 1);
        assertThat(testThreat.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testThreat.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testThreat.getProbability()).isEqualTo(UPDATED_PROBABILITY);
        assertThat(testThreat.getReference()).isEqualTo(UPDATED_REFERENCE);
        assertThat(testThreat.getRefId()).isEqualTo(UPDATED_REF_ID);
    }

    @Test
    @Transactional
    void patchNonExistingThreat() throws Exception {
        int databaseSizeBeforeUpdate = threatRepository.findAll().size();
        threat.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restThreatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, threat.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(threat))
            )
            .andExpect(status().isBadRequest());

        // Validate the Threat in the database
        List<Threat> threatList = threatRepository.findAll();
        assertThat(threatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchThreat() throws Exception {
        int databaseSizeBeforeUpdate = threatRepository.findAll().size();
        threat.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restThreatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(threat))
            )
            .andExpect(status().isBadRequest());

        // Validate the Threat in the database
        List<Threat> threatList = threatRepository.findAll();
        assertThat(threatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamThreat() throws Exception {
        int databaseSizeBeforeUpdate = threatRepository.findAll().size();
        threat.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restThreatMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(threat)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Threat in the database
        List<Threat> threatList = threatRepository.findAll();
        assertThat(threatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteThreat() throws Exception {
        // Initialize the database
        threatRepository.saveAndFlush(threat);

        int databaseSizeBeforeDelete = threatRepository.findAll().size();

        // Delete the threat
        restThreatMockMvc
            .perform(delete(ENTITY_API_URL_ID, threat.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Threat> threatList = threatRepository.findAll();
        assertThat(threatList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
