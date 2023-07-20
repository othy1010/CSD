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
import org.csd.core.domain.enumeration.AgreementThreshold;
import org.csd.core.domain.enumeration.EvaluationKind;
import org.csd.core.domain.enumeration.ProcessKind;
import org.csd.core.repository.CodecisionMethodRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CodecisionMethodResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CodecisionMethodResourceIT {

    private static final ProcessKind DEFAULT_PROCESS_KIND = ProcessKind.CONSENSUS;
    private static final ProcessKind UPDATED_PROCESS_KIND = ProcessKind.MAJORITY;

    private static final EvaluationKind DEFAULT_EVALUATION_KIND = EvaluationKind.YESNO;
    private static final EvaluationKind UPDATED_EVALUATION_KIND = EvaluationKind.RATING;

    private static final AgreementThreshold DEFAULT_AGREEMENT_THRESHOLD = AgreementThreshold.LOW;
    private static final AgreementThreshold UPDATED_AGREEMENT_THRESHOLD = AgreementThreshold.MEDIUM;

    private static final String ENTITY_API_URL = "/api/codecision-methods";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CodecisionMethodRepository codecisionMethodRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCodecisionMethodMockMvc;

    private CodecisionMethod codecisionMethod;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CodecisionMethod createEntity(EntityManager em) {
        CodecisionMethod codecisionMethod = new CodecisionMethod()
            .processKind(DEFAULT_PROCESS_KIND)
            .evaluationKind(DEFAULT_EVALUATION_KIND)
            .agreementThreshold(DEFAULT_AGREEMENT_THRESHOLD);
        return codecisionMethod;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CodecisionMethod createUpdatedEntity(EntityManager em) {
        CodecisionMethod codecisionMethod = new CodecisionMethod()
            .processKind(UPDATED_PROCESS_KIND)
            .evaluationKind(UPDATED_EVALUATION_KIND)
            .agreementThreshold(UPDATED_AGREEMENT_THRESHOLD);
        return codecisionMethod;
    }

    @BeforeEach
    public void initTest() {
        codecisionMethod = createEntity(em);
    }

    @Test
    @Transactional
    void createCodecisionMethod() throws Exception {
        int databaseSizeBeforeCreate = codecisionMethodRepository.findAll().size();
        // Create the CodecisionMethod
        restCodecisionMethodMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(codecisionMethod))
            )
            .andExpect(status().isCreated());

        // Validate the CodecisionMethod in the database
        List<CodecisionMethod> codecisionMethodList = codecisionMethodRepository.findAll();
        assertThat(codecisionMethodList).hasSize(databaseSizeBeforeCreate + 1);
        CodecisionMethod testCodecisionMethod = codecisionMethodList.get(codecisionMethodList.size() - 1);
        assertThat(testCodecisionMethod.getProcessKind()).isEqualTo(DEFAULT_PROCESS_KIND);
        assertThat(testCodecisionMethod.getEvaluationKind()).isEqualTo(DEFAULT_EVALUATION_KIND);
        assertThat(testCodecisionMethod.getAgreementThreshold()).isEqualTo(DEFAULT_AGREEMENT_THRESHOLD);
    }

    @Test
    @Transactional
    void createCodecisionMethodWithExistingId() throws Exception {
        // Create the CodecisionMethod with an existing ID
        codecisionMethod.setId(1L);

        int databaseSizeBeforeCreate = codecisionMethodRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCodecisionMethodMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(codecisionMethod))
            )
            .andExpect(status().isBadRequest());

        // Validate the CodecisionMethod in the database
        List<CodecisionMethod> codecisionMethodList = codecisionMethodRepository.findAll();
        assertThat(codecisionMethodList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCodecisionMethods() throws Exception {
        // Initialize the database
        codecisionMethodRepository.saveAndFlush(codecisionMethod);

        // Get all the codecisionMethodList
        restCodecisionMethodMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(codecisionMethod.getId().intValue())))
            .andExpect(jsonPath("$.[*].processKind").value(hasItem(DEFAULT_PROCESS_KIND.toString())))
            .andExpect(jsonPath("$.[*].evaluationKind").value(hasItem(DEFAULT_EVALUATION_KIND.toString())))
            .andExpect(jsonPath("$.[*].agreementThreshold").value(hasItem(DEFAULT_AGREEMENT_THRESHOLD.toString())));
    }

    @Test
    @Transactional
    void getCodecisionMethod() throws Exception {
        // Initialize the database
        codecisionMethodRepository.saveAndFlush(codecisionMethod);

        // Get the codecisionMethod
        restCodecisionMethodMockMvc
            .perform(get(ENTITY_API_URL_ID, codecisionMethod.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(codecisionMethod.getId().intValue()))
            .andExpect(jsonPath("$.processKind").value(DEFAULT_PROCESS_KIND.toString()))
            .andExpect(jsonPath("$.evaluationKind").value(DEFAULT_EVALUATION_KIND.toString()))
            .andExpect(jsonPath("$.agreementThreshold").value(DEFAULT_AGREEMENT_THRESHOLD.toString()));
    }

    @Test
    @Transactional
    void getNonExistingCodecisionMethod() throws Exception {
        // Get the codecisionMethod
        restCodecisionMethodMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCodecisionMethod() throws Exception {
        // Initialize the database
        codecisionMethodRepository.saveAndFlush(codecisionMethod);

        int databaseSizeBeforeUpdate = codecisionMethodRepository.findAll().size();

        // Update the codecisionMethod
        CodecisionMethod updatedCodecisionMethod = codecisionMethodRepository.findById(codecisionMethod.getId()).get();
        // Disconnect from session so that the updates on updatedCodecisionMethod are not directly saved in db
        em.detach(updatedCodecisionMethod);
        updatedCodecisionMethod
            .processKind(UPDATED_PROCESS_KIND)
            .evaluationKind(UPDATED_EVALUATION_KIND)
            .agreementThreshold(UPDATED_AGREEMENT_THRESHOLD);

        restCodecisionMethodMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCodecisionMethod.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCodecisionMethod))
            )
            .andExpect(status().isOk());

        // Validate the CodecisionMethod in the database
        List<CodecisionMethod> codecisionMethodList = codecisionMethodRepository.findAll();
        assertThat(codecisionMethodList).hasSize(databaseSizeBeforeUpdate);
        CodecisionMethod testCodecisionMethod = codecisionMethodList.get(codecisionMethodList.size() - 1);
        assertThat(testCodecisionMethod.getProcessKind()).isEqualTo(UPDATED_PROCESS_KIND);
        assertThat(testCodecisionMethod.getEvaluationKind()).isEqualTo(UPDATED_EVALUATION_KIND);
        assertThat(testCodecisionMethod.getAgreementThreshold()).isEqualTo(UPDATED_AGREEMENT_THRESHOLD);
    }

    @Test
    @Transactional
    void putNonExistingCodecisionMethod() throws Exception {
        int databaseSizeBeforeUpdate = codecisionMethodRepository.findAll().size();
        codecisionMethod.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCodecisionMethodMockMvc
            .perform(
                put(ENTITY_API_URL_ID, codecisionMethod.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(codecisionMethod))
            )
            .andExpect(status().isBadRequest());

        // Validate the CodecisionMethod in the database
        List<CodecisionMethod> codecisionMethodList = codecisionMethodRepository.findAll();
        assertThat(codecisionMethodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCodecisionMethod() throws Exception {
        int databaseSizeBeforeUpdate = codecisionMethodRepository.findAll().size();
        codecisionMethod.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCodecisionMethodMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(codecisionMethod))
            )
            .andExpect(status().isBadRequest());

        // Validate the CodecisionMethod in the database
        List<CodecisionMethod> codecisionMethodList = codecisionMethodRepository.findAll();
        assertThat(codecisionMethodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCodecisionMethod() throws Exception {
        int databaseSizeBeforeUpdate = codecisionMethodRepository.findAll().size();
        codecisionMethod.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCodecisionMethodMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(codecisionMethod))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CodecisionMethod in the database
        List<CodecisionMethod> codecisionMethodList = codecisionMethodRepository.findAll();
        assertThat(codecisionMethodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCodecisionMethodWithPatch() throws Exception {
        // Initialize the database
        codecisionMethodRepository.saveAndFlush(codecisionMethod);

        int databaseSizeBeforeUpdate = codecisionMethodRepository.findAll().size();

        // Update the codecisionMethod using partial update
        CodecisionMethod partialUpdatedCodecisionMethod = new CodecisionMethod();
        partialUpdatedCodecisionMethod.setId(codecisionMethod.getId());

        partialUpdatedCodecisionMethod.processKind(UPDATED_PROCESS_KIND);

        restCodecisionMethodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCodecisionMethod.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCodecisionMethod))
            )
            .andExpect(status().isOk());

        // Validate the CodecisionMethod in the database
        List<CodecisionMethod> codecisionMethodList = codecisionMethodRepository.findAll();
        assertThat(codecisionMethodList).hasSize(databaseSizeBeforeUpdate);
        CodecisionMethod testCodecisionMethod = codecisionMethodList.get(codecisionMethodList.size() - 1);
        assertThat(testCodecisionMethod.getProcessKind()).isEqualTo(UPDATED_PROCESS_KIND);
        assertThat(testCodecisionMethod.getEvaluationKind()).isEqualTo(DEFAULT_EVALUATION_KIND);
        assertThat(testCodecisionMethod.getAgreementThreshold()).isEqualTo(DEFAULT_AGREEMENT_THRESHOLD);
    }

    @Test
    @Transactional
    void fullUpdateCodecisionMethodWithPatch() throws Exception {
        // Initialize the database
        codecisionMethodRepository.saveAndFlush(codecisionMethod);

        int databaseSizeBeforeUpdate = codecisionMethodRepository.findAll().size();

        // Update the codecisionMethod using partial update
        CodecisionMethod partialUpdatedCodecisionMethod = new CodecisionMethod();
        partialUpdatedCodecisionMethod.setId(codecisionMethod.getId());

        partialUpdatedCodecisionMethod
            .processKind(UPDATED_PROCESS_KIND)
            .evaluationKind(UPDATED_EVALUATION_KIND)
            .agreementThreshold(UPDATED_AGREEMENT_THRESHOLD);

        restCodecisionMethodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCodecisionMethod.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCodecisionMethod))
            )
            .andExpect(status().isOk());

        // Validate the CodecisionMethod in the database
        List<CodecisionMethod> codecisionMethodList = codecisionMethodRepository.findAll();
        assertThat(codecisionMethodList).hasSize(databaseSizeBeforeUpdate);
        CodecisionMethod testCodecisionMethod = codecisionMethodList.get(codecisionMethodList.size() - 1);
        assertThat(testCodecisionMethod.getProcessKind()).isEqualTo(UPDATED_PROCESS_KIND);
        assertThat(testCodecisionMethod.getEvaluationKind()).isEqualTo(UPDATED_EVALUATION_KIND);
        assertThat(testCodecisionMethod.getAgreementThreshold()).isEqualTo(UPDATED_AGREEMENT_THRESHOLD);
    }

    @Test
    @Transactional
    void patchNonExistingCodecisionMethod() throws Exception {
        int databaseSizeBeforeUpdate = codecisionMethodRepository.findAll().size();
        codecisionMethod.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCodecisionMethodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, codecisionMethod.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(codecisionMethod))
            )
            .andExpect(status().isBadRequest());

        // Validate the CodecisionMethod in the database
        List<CodecisionMethod> codecisionMethodList = codecisionMethodRepository.findAll();
        assertThat(codecisionMethodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCodecisionMethod() throws Exception {
        int databaseSizeBeforeUpdate = codecisionMethodRepository.findAll().size();
        codecisionMethod.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCodecisionMethodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(codecisionMethod))
            )
            .andExpect(status().isBadRequest());

        // Validate the CodecisionMethod in the database
        List<CodecisionMethod> codecisionMethodList = codecisionMethodRepository.findAll();
        assertThat(codecisionMethodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCodecisionMethod() throws Exception {
        int databaseSizeBeforeUpdate = codecisionMethodRepository.findAll().size();
        codecisionMethod.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCodecisionMethodMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(codecisionMethod))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CodecisionMethod in the database
        List<CodecisionMethod> codecisionMethodList = codecisionMethodRepository.findAll();
        assertThat(codecisionMethodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCodecisionMethod() throws Exception {
        // Initialize the database
        codecisionMethodRepository.saveAndFlush(codecisionMethod);

        int databaseSizeBeforeDelete = codecisionMethodRepository.findAll().size();

        // Delete the codecisionMethod
        restCodecisionMethodMockMvc
            .perform(delete(ENTITY_API_URL_ID, codecisionMethod.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CodecisionMethod> codecisionMethodList = codecisionMethodRepository.findAll();
        assertThat(codecisionMethodList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
