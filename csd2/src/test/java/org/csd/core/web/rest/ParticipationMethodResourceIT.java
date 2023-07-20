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
import org.csd.core.domain.Parameter;
import org.csd.core.domain.ParticipationMethod;
import org.csd.core.domain.SelectionCriteria;
import org.csd.core.domain.enumeration.ParticipationType;
import org.csd.core.repository.ParticipationMethodRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ParticipationMethodResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ParticipationMethodResourceIT {

    private static final ParticipationType DEFAULT_TYPE = ParticipationType.RESTRICTED;
    private static final ParticipationType UPDATED_TYPE = ParticipationType.DEMOCRATIC;

    private static final String ENTITY_API_URL = "/api/participation-methods";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ParticipationMethodRepository participationMethodRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restParticipationMethodMockMvc;

    private ParticipationMethod participationMethod;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ParticipationMethod createEntity(EntityManager em) {
        ParticipationMethod participationMethod = new ParticipationMethod().type(DEFAULT_TYPE);
        // Add required entity
        Parameter parameter;
        if (TestUtil.findAll(em, Parameter.class).isEmpty()) {
            parameter = ParameterResourceIT.createEntity(em);
            em.persist(parameter);
            em.flush();
        } else {
            parameter = TestUtil.findAll(em, Parameter.class).get(0);
        }
        participationMethod.getParameters().add(parameter);
        // Add required entity
        SelectionCriteria selectionCriteria;
        if (TestUtil.findAll(em, SelectionCriteria.class).isEmpty()) {
            selectionCriteria = SelectionCriteriaResourceIT.createEntity(em);
            em.persist(selectionCriteria);
            em.flush();
        } else {
            selectionCriteria = TestUtil.findAll(em, SelectionCriteria.class).get(0);
        }
        participationMethod.getSelectionCriteria().add(selectionCriteria);
        return participationMethod;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ParticipationMethod createUpdatedEntity(EntityManager em) {
        ParticipationMethod participationMethod = new ParticipationMethod().type(UPDATED_TYPE);
        // Add required entity
        Parameter parameter;
        if (TestUtil.findAll(em, Parameter.class).isEmpty()) {
            parameter = ParameterResourceIT.createUpdatedEntity(em);
            em.persist(parameter);
            em.flush();
        } else {
            parameter = TestUtil.findAll(em, Parameter.class).get(0);
        }
        participationMethod.getParameters().add(parameter);
        // Add required entity
        SelectionCriteria selectionCriteria;
        if (TestUtil.findAll(em, SelectionCriteria.class).isEmpty()) {
            selectionCriteria = SelectionCriteriaResourceIT.createUpdatedEntity(em);
            em.persist(selectionCriteria);
            em.flush();
        } else {
            selectionCriteria = TestUtil.findAll(em, SelectionCriteria.class).get(0);
        }
        participationMethod.getSelectionCriteria().add(selectionCriteria);
        return participationMethod;
    }

    @BeforeEach
    public void initTest() {
        participationMethod = createEntity(em);
    }

    @Test
    @Transactional
    void createParticipationMethod() throws Exception {
        int databaseSizeBeforeCreate = participationMethodRepository.findAll().size();
        // Create the ParticipationMethod
        restParticipationMethodMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(participationMethod))
            )
            .andExpect(status().isCreated());

        // Validate the ParticipationMethod in the database
        List<ParticipationMethod> participationMethodList = participationMethodRepository.findAll();
        assertThat(participationMethodList).hasSize(databaseSizeBeforeCreate + 1);
        ParticipationMethod testParticipationMethod = participationMethodList.get(participationMethodList.size() - 1);
        assertThat(testParticipationMethod.getType()).isEqualTo(DEFAULT_TYPE);
    }

    @Test
    @Transactional
    void createParticipationMethodWithExistingId() throws Exception {
        // Create the ParticipationMethod with an existing ID
        participationMethod.setId(1L);

        int databaseSizeBeforeCreate = participationMethodRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restParticipationMethodMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(participationMethod))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParticipationMethod in the database
        List<ParticipationMethod> participationMethodList = participationMethodRepository.findAll();
        assertThat(participationMethodList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllParticipationMethods() throws Exception {
        // Initialize the database
        participationMethodRepository.saveAndFlush(participationMethod);

        // Get all the participationMethodList
        restParticipationMethodMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(participationMethod.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }

    @Test
    @Transactional
    void getParticipationMethod() throws Exception {
        // Initialize the database
        participationMethodRepository.saveAndFlush(participationMethod);

        // Get the participationMethod
        restParticipationMethodMockMvc
            .perform(get(ENTITY_API_URL_ID, participationMethod.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(participationMethod.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingParticipationMethod() throws Exception {
        // Get the participationMethod
        restParticipationMethodMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingParticipationMethod() throws Exception {
        // Initialize the database
        participationMethodRepository.saveAndFlush(participationMethod);

        int databaseSizeBeforeUpdate = participationMethodRepository.findAll().size();

        // Update the participationMethod
        ParticipationMethod updatedParticipationMethod = participationMethodRepository.findById(participationMethod.getId()).get();
        // Disconnect from session so that the updates on updatedParticipationMethod are not directly saved in db
        em.detach(updatedParticipationMethod);
        updatedParticipationMethod.type(UPDATED_TYPE);

        restParticipationMethodMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedParticipationMethod.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedParticipationMethod))
            )
            .andExpect(status().isOk());

        // Validate the ParticipationMethod in the database
        List<ParticipationMethod> participationMethodList = participationMethodRepository.findAll();
        assertThat(participationMethodList).hasSize(databaseSizeBeforeUpdate);
        ParticipationMethod testParticipationMethod = participationMethodList.get(participationMethodList.size() - 1);
        assertThat(testParticipationMethod.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingParticipationMethod() throws Exception {
        int databaseSizeBeforeUpdate = participationMethodRepository.findAll().size();
        participationMethod.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restParticipationMethodMockMvc
            .perform(
                put(ENTITY_API_URL_ID, participationMethod.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(participationMethod))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParticipationMethod in the database
        List<ParticipationMethod> participationMethodList = participationMethodRepository.findAll();
        assertThat(participationMethodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchParticipationMethod() throws Exception {
        int databaseSizeBeforeUpdate = participationMethodRepository.findAll().size();
        participationMethod.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParticipationMethodMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(participationMethod))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParticipationMethod in the database
        List<ParticipationMethod> participationMethodList = participationMethodRepository.findAll();
        assertThat(participationMethodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamParticipationMethod() throws Exception {
        int databaseSizeBeforeUpdate = participationMethodRepository.findAll().size();
        participationMethod.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParticipationMethodMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(participationMethod))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ParticipationMethod in the database
        List<ParticipationMethod> participationMethodList = participationMethodRepository.findAll();
        assertThat(participationMethodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateParticipationMethodWithPatch() throws Exception {
        // Initialize the database
        participationMethodRepository.saveAndFlush(participationMethod);

        int databaseSizeBeforeUpdate = participationMethodRepository.findAll().size();

        // Update the participationMethod using partial update
        ParticipationMethod partialUpdatedParticipationMethod = new ParticipationMethod();
        partialUpdatedParticipationMethod.setId(participationMethod.getId());

        partialUpdatedParticipationMethod.type(UPDATED_TYPE);

        restParticipationMethodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedParticipationMethod.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedParticipationMethod))
            )
            .andExpect(status().isOk());

        // Validate the ParticipationMethod in the database
        List<ParticipationMethod> participationMethodList = participationMethodRepository.findAll();
        assertThat(participationMethodList).hasSize(databaseSizeBeforeUpdate);
        ParticipationMethod testParticipationMethod = participationMethodList.get(participationMethodList.size() - 1);
        assertThat(testParticipationMethod.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateParticipationMethodWithPatch() throws Exception {
        // Initialize the database
        participationMethodRepository.saveAndFlush(participationMethod);

        int databaseSizeBeforeUpdate = participationMethodRepository.findAll().size();

        // Update the participationMethod using partial update
        ParticipationMethod partialUpdatedParticipationMethod = new ParticipationMethod();
        partialUpdatedParticipationMethod.setId(participationMethod.getId());

        partialUpdatedParticipationMethod.type(UPDATED_TYPE);

        restParticipationMethodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedParticipationMethod.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedParticipationMethod))
            )
            .andExpect(status().isOk());

        // Validate the ParticipationMethod in the database
        List<ParticipationMethod> participationMethodList = participationMethodRepository.findAll();
        assertThat(participationMethodList).hasSize(databaseSizeBeforeUpdate);
        ParticipationMethod testParticipationMethod = participationMethodList.get(participationMethodList.size() - 1);
        assertThat(testParticipationMethod.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingParticipationMethod() throws Exception {
        int databaseSizeBeforeUpdate = participationMethodRepository.findAll().size();
        participationMethod.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restParticipationMethodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, participationMethod.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(participationMethod))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParticipationMethod in the database
        List<ParticipationMethod> participationMethodList = participationMethodRepository.findAll();
        assertThat(participationMethodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchParticipationMethod() throws Exception {
        int databaseSizeBeforeUpdate = participationMethodRepository.findAll().size();
        participationMethod.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParticipationMethodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(participationMethod))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParticipationMethod in the database
        List<ParticipationMethod> participationMethodList = participationMethodRepository.findAll();
        assertThat(participationMethodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamParticipationMethod() throws Exception {
        int databaseSizeBeforeUpdate = participationMethodRepository.findAll().size();
        participationMethod.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParticipationMethodMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(participationMethod))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ParticipationMethod in the database
        List<ParticipationMethod> participationMethodList = participationMethodRepository.findAll();
        assertThat(participationMethodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteParticipationMethod() throws Exception {
        // Initialize the database
        participationMethodRepository.saveAndFlush(participationMethod);

        int databaseSizeBeforeDelete = participationMethodRepository.findAll().size();

        // Delete the participationMethod
        restParticipationMethodMockMvc
            .perform(delete(ENTITY_API_URL_ID, participationMethod.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ParticipationMethod> participationMethodList = participationMethodRepository.findAll();
        assertThat(participationMethodList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
