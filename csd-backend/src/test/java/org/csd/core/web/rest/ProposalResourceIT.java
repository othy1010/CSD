package org.csd.core.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.csd.core.IntegrationTest;
import org.csd.core.domain.InvolvedUser;
import org.csd.core.domain.Proposal;
import org.csd.core.domain.enumeration.ProposalState;
import org.csd.core.repository.ProposalRepository;
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
 * Integration tests for the {@link ProposalResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ProposalResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_CREATION_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATION_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final ProposalState DEFAULT_PROPOSAL_STATE = ProposalState.ACCEPTED;
    private static final ProposalState UPDATED_PROPOSAL_STATE = ProposalState.REJECTED;

    private static final String ENTITY_API_URL = "/api/proposals";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProposalRepository proposalRepository;

    @Mock
    private ProposalRepository proposalRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProposalMockMvc;

    private Proposal proposal;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Proposal createEntity(EntityManager em) {
        Proposal proposal = new Proposal()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .creationDate(DEFAULT_CREATION_DATE)
            .proposalState(DEFAULT_PROPOSAL_STATE);
        // Add required entity
        InvolvedUser involvedUser;
        if (TestUtil.findAll(em, InvolvedUser.class).isEmpty()) {
            involvedUser = InvolvedUserResourceIT.createEntity(em);
            em.persist(involvedUser);
            em.flush();
        } else {
            involvedUser = TestUtil.findAll(em, InvolvedUser.class).get(0);
        }
        proposal.setUser(involvedUser);
        return proposal;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Proposal createUpdatedEntity(EntityManager em) {
        Proposal proposal = new Proposal()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .creationDate(UPDATED_CREATION_DATE)
            .proposalState(UPDATED_PROPOSAL_STATE);
        // Add required entity
        InvolvedUser involvedUser;
        if (TestUtil.findAll(em, InvolvedUser.class).isEmpty()) {
            involvedUser = InvolvedUserResourceIT.createUpdatedEntity(em);
            em.persist(involvedUser);
            em.flush();
        } else {
            involvedUser = TestUtil.findAll(em, InvolvedUser.class).get(0);
        }
        proposal.setUser(involvedUser);
        return proposal;
    }

    @BeforeEach
    public void initTest() {
        proposal = createEntity(em);
    }

    @Test
    @Transactional
    void createProposal() throws Exception {
        int databaseSizeBeforeCreate = proposalRepository.findAll().size();
        // Create the Proposal
        restProposalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(proposal)))
            .andExpect(status().isCreated());

        // Validate the Proposal in the database
        List<Proposal> proposalList = proposalRepository.findAll();
        assertThat(proposalList).hasSize(databaseSizeBeforeCreate + 1);
        Proposal testProposal = proposalList.get(proposalList.size() - 1);
        assertThat(testProposal.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testProposal.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testProposal.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
        assertThat(testProposal.getProposalState()).isEqualTo(DEFAULT_PROPOSAL_STATE);
    }

    @Test
    @Transactional
    void createProposalWithExistingId() throws Exception {
        // Create the Proposal with an existing ID
        proposal.setId(1L);

        int databaseSizeBeforeCreate = proposalRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProposalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(proposal)))
            .andExpect(status().isBadRequest());

        // Validate the Proposal in the database
        List<Proposal> proposalList = proposalRepository.findAll();
        assertThat(proposalList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProposals() throws Exception {
        // Initialize the database
        proposalRepository.saveAndFlush(proposal);

        // Get all the proposalList
        restProposalMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(proposal.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(DEFAULT_CREATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].proposalState").value(hasItem(DEFAULT_PROPOSAL_STATE.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProposalsWithEagerRelationshipsIsEnabled() throws Exception {
        when(proposalRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProposalMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(proposalRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProposalsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(proposalRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProposalMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(proposalRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getProposal() throws Exception {
        // Initialize the database
        proposalRepository.saveAndFlush(proposal);

        // Get the proposal
        restProposalMockMvc
            .perform(get(ENTITY_API_URL_ID, proposal.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(proposal.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.creationDate").value(DEFAULT_CREATION_DATE.toString()))
            .andExpect(jsonPath("$.proposalState").value(DEFAULT_PROPOSAL_STATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingProposal() throws Exception {
        // Get the proposal
        restProposalMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProposal() throws Exception {
        // Initialize the database
        proposalRepository.saveAndFlush(proposal);

        int databaseSizeBeforeUpdate = proposalRepository.findAll().size();

        // Update the proposal
        Proposal updatedProposal = proposalRepository.findById(proposal.getId()).get();
        // Disconnect from session so that the updates on updatedProposal are not directly saved in db
        em.detach(updatedProposal);
        updatedProposal
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .creationDate(UPDATED_CREATION_DATE)
            .proposalState(UPDATED_PROPOSAL_STATE);

        restProposalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProposal.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProposal))
            )
            .andExpect(status().isOk());

        // Validate the Proposal in the database
        List<Proposal> proposalList = proposalRepository.findAll();
        assertThat(proposalList).hasSize(databaseSizeBeforeUpdate);
        Proposal testProposal = proposalList.get(proposalList.size() - 1);
        assertThat(testProposal.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProposal.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProposal.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
        assertThat(testProposal.getProposalState()).isEqualTo(UPDATED_PROPOSAL_STATE);
    }

    @Test
    @Transactional
    void putNonExistingProposal() throws Exception {
        int databaseSizeBeforeUpdate = proposalRepository.findAll().size();
        proposal.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProposalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, proposal.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(proposal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Proposal in the database
        List<Proposal> proposalList = proposalRepository.findAll();
        assertThat(proposalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProposal() throws Exception {
        int databaseSizeBeforeUpdate = proposalRepository.findAll().size();
        proposal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProposalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(proposal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Proposal in the database
        List<Proposal> proposalList = proposalRepository.findAll();
        assertThat(proposalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProposal() throws Exception {
        int databaseSizeBeforeUpdate = proposalRepository.findAll().size();
        proposal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProposalMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(proposal)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Proposal in the database
        List<Proposal> proposalList = proposalRepository.findAll();
        assertThat(proposalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProposalWithPatch() throws Exception {
        // Initialize the database
        proposalRepository.saveAndFlush(proposal);

        int databaseSizeBeforeUpdate = proposalRepository.findAll().size();

        // Update the proposal using partial update
        Proposal partialUpdatedProposal = new Proposal();
        partialUpdatedProposal.setId(proposal.getId());

        partialUpdatedProposal.creationDate(UPDATED_CREATION_DATE).proposalState(UPDATED_PROPOSAL_STATE);

        restProposalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProposal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProposal))
            )
            .andExpect(status().isOk());

        // Validate the Proposal in the database
        List<Proposal> proposalList = proposalRepository.findAll();
        assertThat(proposalList).hasSize(databaseSizeBeforeUpdate);
        Proposal testProposal = proposalList.get(proposalList.size() - 1);
        assertThat(testProposal.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testProposal.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testProposal.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
        assertThat(testProposal.getProposalState()).isEqualTo(UPDATED_PROPOSAL_STATE);
    }

    @Test
    @Transactional
    void fullUpdateProposalWithPatch() throws Exception {
        // Initialize the database
        proposalRepository.saveAndFlush(proposal);

        int databaseSizeBeforeUpdate = proposalRepository.findAll().size();

        // Update the proposal using partial update
        Proposal partialUpdatedProposal = new Proposal();
        partialUpdatedProposal.setId(proposal.getId());

        partialUpdatedProposal
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .creationDate(UPDATED_CREATION_DATE)
            .proposalState(UPDATED_PROPOSAL_STATE);

        restProposalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProposal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProposal))
            )
            .andExpect(status().isOk());

        // Validate the Proposal in the database
        List<Proposal> proposalList = proposalRepository.findAll();
        assertThat(proposalList).hasSize(databaseSizeBeforeUpdate);
        Proposal testProposal = proposalList.get(proposalList.size() - 1);
        assertThat(testProposal.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProposal.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProposal.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
        assertThat(testProposal.getProposalState()).isEqualTo(UPDATED_PROPOSAL_STATE);
    }

    @Test
    @Transactional
    void patchNonExistingProposal() throws Exception {
        int databaseSizeBeforeUpdate = proposalRepository.findAll().size();
        proposal.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProposalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, proposal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(proposal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Proposal in the database
        List<Proposal> proposalList = proposalRepository.findAll();
        assertThat(proposalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProposal() throws Exception {
        int databaseSizeBeforeUpdate = proposalRepository.findAll().size();
        proposal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProposalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(proposal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Proposal in the database
        List<Proposal> proposalList = proposalRepository.findAll();
        assertThat(proposalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProposal() throws Exception {
        int databaseSizeBeforeUpdate = proposalRepository.findAll().size();
        proposal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProposalMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(proposal)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Proposal in the database
        List<Proposal> proposalList = proposalRepository.findAll();
        assertThat(proposalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProposal() throws Exception {
        // Initialize the database
        proposalRepository.saveAndFlush(proposal);

        int databaseSizeBeforeDelete = proposalRepository.findAll().size();

        // Delete the proposal
        restProposalMockMvc
            .perform(delete(ENTITY_API_URL_ID, proposal.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Proposal> proposalList = proposalRepository.findAll();
        assertThat(proposalList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
