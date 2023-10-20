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
import org.csd.core.domain.InvolvedUser;
import org.csd.core.domain.User;
import org.csd.core.domain.enumeration.UserRole;
import org.csd.core.repository.InvolvedUserRepository;
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
 * Integration tests for the {@link InvolvedUserResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class InvolvedUserResourceIT {

    private static final Integer DEFAULT_EXPERTISE_LEVEL = 1;
    private static final Integer UPDATED_EXPERTISE_LEVEL = 2;

    private static final UserRole DEFAULT_USER_ROLE = UserRole.DEVELOPER;
    private static final UserRole UPDATED_USER_ROLE = UserRole.ARCHITECT;

    private static final Boolean DEFAULT_IS_MODERATOR = false;
    private static final Boolean UPDATED_IS_MODERATOR = true;

    private static final Boolean DEFAULT_IS_ELIGIBLE_DM = false;
    private static final Boolean UPDATED_IS_ELIGIBLE_DM = true;

    private static final String ENTITY_API_URL = "/api/involved-users";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private InvolvedUserRepository involvedUserRepository;

    @Mock
    private InvolvedUserRepository involvedUserRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restInvolvedUserMockMvc;

    private InvolvedUser involvedUser;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static InvolvedUser createEntity(EntityManager em) {
        InvolvedUser involvedUser = new InvolvedUser()
            .expertiseLevel(DEFAULT_EXPERTISE_LEVEL)
            .userRole(DEFAULT_USER_ROLE)
            .isModerator(DEFAULT_IS_MODERATOR)
            .isEligibleDM(DEFAULT_IS_ELIGIBLE_DM);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        involvedUser.setUser(user);
        return involvedUser;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static InvolvedUser createUpdatedEntity(EntityManager em) {
        InvolvedUser involvedUser = new InvolvedUser()
            .expertiseLevel(UPDATED_EXPERTISE_LEVEL)
            .userRole(UPDATED_USER_ROLE)
            .isModerator(UPDATED_IS_MODERATOR)
            .isEligibleDM(UPDATED_IS_ELIGIBLE_DM);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        involvedUser.setUser(user);
        return involvedUser;
    }

    @BeforeEach
    public void initTest() {
        involvedUser = createEntity(em);
    }

    @Test
    @Transactional
    void createInvolvedUser() throws Exception {
        int databaseSizeBeforeCreate = involvedUserRepository.findAll().size();
        // Create the InvolvedUser
        restInvolvedUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(involvedUser)))
            .andExpect(status().isCreated());

        // Validate the InvolvedUser in the database
        List<InvolvedUser> involvedUserList = involvedUserRepository.findAll();
        assertThat(involvedUserList).hasSize(databaseSizeBeforeCreate + 1);
        InvolvedUser testInvolvedUser = involvedUserList.get(involvedUserList.size() - 1);
        assertThat(testInvolvedUser.getExpertiseLevel()).isEqualTo(DEFAULT_EXPERTISE_LEVEL);
        assertThat(testInvolvedUser.getUserRole()).isEqualTo(DEFAULT_USER_ROLE);
        assertThat(testInvolvedUser.getIsModerator()).isEqualTo(DEFAULT_IS_MODERATOR);
        assertThat(testInvolvedUser.getIsEligibleDM()).isEqualTo(DEFAULT_IS_ELIGIBLE_DM);
    }

    @Test
    @Transactional
    void createInvolvedUserWithExistingId() throws Exception {
        // Create the InvolvedUser with an existing ID
        involvedUser.setId(1L);

        int databaseSizeBeforeCreate = involvedUserRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restInvolvedUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(involvedUser)))
            .andExpect(status().isBadRequest());

        // Validate the InvolvedUser in the database
        List<InvolvedUser> involvedUserList = involvedUserRepository.findAll();
        assertThat(involvedUserList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllInvolvedUsers() throws Exception {
        // Initialize the database
        involvedUserRepository.saveAndFlush(involvedUser);

        // Get all the involvedUserList
        restInvolvedUserMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(involvedUser.getId().intValue())))
            .andExpect(jsonPath("$.[*].expertiseLevel").value(hasItem(DEFAULT_EXPERTISE_LEVEL)))
            .andExpect(jsonPath("$.[*].userRole").value(hasItem(DEFAULT_USER_ROLE.toString())))
            .andExpect(jsonPath("$.[*].isModerator").value(hasItem(DEFAULT_IS_MODERATOR.booleanValue())))
            .andExpect(jsonPath("$.[*].isEligibleDM").value(hasItem(DEFAULT_IS_ELIGIBLE_DM.booleanValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllInvolvedUsersWithEagerRelationshipsIsEnabled() throws Exception {
        when(involvedUserRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restInvolvedUserMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(involvedUserRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllInvolvedUsersWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(involvedUserRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restInvolvedUserMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(involvedUserRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getInvolvedUser() throws Exception {
        // Initialize the database
        involvedUserRepository.saveAndFlush(involvedUser);

        // Get the involvedUser
        restInvolvedUserMockMvc
            .perform(get(ENTITY_API_URL_ID, involvedUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(involvedUser.getId().intValue()))
            .andExpect(jsonPath("$.expertiseLevel").value(DEFAULT_EXPERTISE_LEVEL))
            .andExpect(jsonPath("$.userRole").value(DEFAULT_USER_ROLE.toString()))
            .andExpect(jsonPath("$.isModerator").value(DEFAULT_IS_MODERATOR.booleanValue()))
            .andExpect(jsonPath("$.isEligibleDM").value(DEFAULT_IS_ELIGIBLE_DM.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingInvolvedUser() throws Exception {
        // Get the involvedUser
        restInvolvedUserMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingInvolvedUser() throws Exception {
        // Initialize the database
        involvedUserRepository.saveAndFlush(involvedUser);

        int databaseSizeBeforeUpdate = involvedUserRepository.findAll().size();

        // Update the involvedUser
        InvolvedUser updatedInvolvedUser = involvedUserRepository.findById(involvedUser.getId()).get();
        // Disconnect from session so that the updates on updatedInvolvedUser are not directly saved in db
        em.detach(updatedInvolvedUser);
        updatedInvolvedUser
            .expertiseLevel(UPDATED_EXPERTISE_LEVEL)
            .userRole(UPDATED_USER_ROLE)
            .isModerator(UPDATED_IS_MODERATOR)
            .isEligibleDM(UPDATED_IS_ELIGIBLE_DM);

        restInvolvedUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedInvolvedUser.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedInvolvedUser))
            )
            .andExpect(status().isOk());

        // Validate the InvolvedUser in the database
        List<InvolvedUser> involvedUserList = involvedUserRepository.findAll();
        assertThat(involvedUserList).hasSize(databaseSizeBeforeUpdate);
        InvolvedUser testInvolvedUser = involvedUserList.get(involvedUserList.size() - 1);
        assertThat(testInvolvedUser.getExpertiseLevel()).isEqualTo(UPDATED_EXPERTISE_LEVEL);
        assertThat(testInvolvedUser.getUserRole()).isEqualTo(UPDATED_USER_ROLE);
        assertThat(testInvolvedUser.getIsModerator()).isEqualTo(UPDATED_IS_MODERATOR);
        assertThat(testInvolvedUser.getIsEligibleDM()).isEqualTo(UPDATED_IS_ELIGIBLE_DM);
    }

    @Test
    @Transactional
    void putNonExistingInvolvedUser() throws Exception {
        int databaseSizeBeforeUpdate = involvedUserRepository.findAll().size();
        involvedUser.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInvolvedUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, involvedUser.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(involvedUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the InvolvedUser in the database
        List<InvolvedUser> involvedUserList = involvedUserRepository.findAll();
        assertThat(involvedUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchInvolvedUser() throws Exception {
        int databaseSizeBeforeUpdate = involvedUserRepository.findAll().size();
        involvedUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInvolvedUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(involvedUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the InvolvedUser in the database
        List<InvolvedUser> involvedUserList = involvedUserRepository.findAll();
        assertThat(involvedUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamInvolvedUser() throws Exception {
        int databaseSizeBeforeUpdate = involvedUserRepository.findAll().size();
        involvedUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInvolvedUserMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(involvedUser)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the InvolvedUser in the database
        List<InvolvedUser> involvedUserList = involvedUserRepository.findAll();
        assertThat(involvedUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateInvolvedUserWithPatch() throws Exception {
        // Initialize the database
        involvedUserRepository.saveAndFlush(involvedUser);

        int databaseSizeBeforeUpdate = involvedUserRepository.findAll().size();

        // Update the involvedUser using partial update
        InvolvedUser partialUpdatedInvolvedUser = new InvolvedUser();
        partialUpdatedInvolvedUser.setId(involvedUser.getId());

        partialUpdatedInvolvedUser.expertiseLevel(UPDATED_EXPERTISE_LEVEL);

        restInvolvedUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInvolvedUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInvolvedUser))
            )
            .andExpect(status().isOk());

        // Validate the InvolvedUser in the database
        List<InvolvedUser> involvedUserList = involvedUserRepository.findAll();
        assertThat(involvedUserList).hasSize(databaseSizeBeforeUpdate);
        InvolvedUser testInvolvedUser = involvedUserList.get(involvedUserList.size() - 1);
        assertThat(testInvolvedUser.getExpertiseLevel()).isEqualTo(UPDATED_EXPERTISE_LEVEL);
        assertThat(testInvolvedUser.getUserRole()).isEqualTo(DEFAULT_USER_ROLE);
        assertThat(testInvolvedUser.getIsModerator()).isEqualTo(DEFAULT_IS_MODERATOR);
        assertThat(testInvolvedUser.getIsEligibleDM()).isEqualTo(DEFAULT_IS_ELIGIBLE_DM);
    }

    @Test
    @Transactional
    void fullUpdateInvolvedUserWithPatch() throws Exception {
        // Initialize the database
        involvedUserRepository.saveAndFlush(involvedUser);

        int databaseSizeBeforeUpdate = involvedUserRepository.findAll().size();

        // Update the involvedUser using partial update
        InvolvedUser partialUpdatedInvolvedUser = new InvolvedUser();
        partialUpdatedInvolvedUser.setId(involvedUser.getId());

        partialUpdatedInvolvedUser
            .expertiseLevel(UPDATED_EXPERTISE_LEVEL)
            .userRole(UPDATED_USER_ROLE)
            .isModerator(UPDATED_IS_MODERATOR)
            .isEligibleDM(UPDATED_IS_ELIGIBLE_DM);

        restInvolvedUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInvolvedUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInvolvedUser))
            )
            .andExpect(status().isOk());

        // Validate the InvolvedUser in the database
        List<InvolvedUser> involvedUserList = involvedUserRepository.findAll();
        assertThat(involvedUserList).hasSize(databaseSizeBeforeUpdate);
        InvolvedUser testInvolvedUser = involvedUserList.get(involvedUserList.size() - 1);
        assertThat(testInvolvedUser.getExpertiseLevel()).isEqualTo(UPDATED_EXPERTISE_LEVEL);
        assertThat(testInvolvedUser.getUserRole()).isEqualTo(UPDATED_USER_ROLE);
        assertThat(testInvolvedUser.getIsModerator()).isEqualTo(UPDATED_IS_MODERATOR);
        assertThat(testInvolvedUser.getIsEligibleDM()).isEqualTo(UPDATED_IS_ELIGIBLE_DM);
    }

    @Test
    @Transactional
    void patchNonExistingInvolvedUser() throws Exception {
        int databaseSizeBeforeUpdate = involvedUserRepository.findAll().size();
        involvedUser.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInvolvedUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, involvedUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(involvedUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the InvolvedUser in the database
        List<InvolvedUser> involvedUserList = involvedUserRepository.findAll();
        assertThat(involvedUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchInvolvedUser() throws Exception {
        int databaseSizeBeforeUpdate = involvedUserRepository.findAll().size();
        involvedUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInvolvedUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(involvedUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the InvolvedUser in the database
        List<InvolvedUser> involvedUserList = involvedUserRepository.findAll();
        assertThat(involvedUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamInvolvedUser() throws Exception {
        int databaseSizeBeforeUpdate = involvedUserRepository.findAll().size();
        involvedUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInvolvedUserMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(involvedUser))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the InvolvedUser in the database
        List<InvolvedUser> involvedUserList = involvedUserRepository.findAll();
        assertThat(involvedUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteInvolvedUser() throws Exception {
        // Initialize the database
        involvedUserRepository.saveAndFlush(involvedUser);

        int databaseSizeBeforeDelete = involvedUserRepository.findAll().size();

        // Delete the involvedUser
        restInvolvedUserMockMvc
            .perform(delete(ENTITY_API_URL_ID, involvedUser.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<InvolvedUser> involvedUserList = involvedUserRepository.findAll();
        assertThat(involvedUserList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
