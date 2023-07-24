package fr.irit.csd.controllers.rest;


import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import fr.irit.csd.domain.InvolvedUser;
import fr.irit.csd.repository.InvolvedUserRepository;
import fr.irit.csd.controllers.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import fr.irit.csd.controllers.rest.errors.HeaderUtil;
import fr.irit.csd.controllers.rest.errors.ResponseUtil;

/**
 * REST controller for managing {@link fr.irit.csd.domain.InvolvedUser}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class InvolvedUserResource {

    private final Logger log = LoggerFactory.getLogger(InvolvedUserResource.class);

    private static final String ENTITY_NAME = "involvedUser";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InvolvedUserRepository involvedUserRepository;

    public InvolvedUserResource(InvolvedUserRepository involvedUserRepository) {
        this.involvedUserRepository = involvedUserRepository;
    }

    /**
     * {@code POST  /involved-users} : Create a new involvedUser.
     *
     * @param involvedUser the involvedUser to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new involvedUser, or with status {@code 400 (Bad Request)} if the involvedUser has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/involved-users")
    public ResponseEntity<InvolvedUser> createInvolvedUser(@Valid @RequestBody InvolvedUser involvedUser) throws URISyntaxException {
        log.debug("REST request to save InvolvedUser : {}", involvedUser);
        if (involvedUser.getId() != null) {
            throw new BadRequestAlertException("A new involvedUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        InvolvedUser result = involvedUserRepository.save(involvedUser);
        return ResponseEntity
            .created(new URI("/api/involved-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /involved-users/:id} : Updates an existing involvedUser.
     *
     * @param id the id of the involvedUser to save.
     * @param involvedUser the involvedUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated involvedUser,
     * or with status {@code 400 (Bad Request)} if the involvedUser is not valid,
     * or with status {@code 500 (Internal Server Error)} if the involvedUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/involved-users/{id}")
    public ResponseEntity<InvolvedUser> updateInvolvedUser(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody InvolvedUser involvedUser
    ) throws URISyntaxException {
        log.debug("REST request to update InvolvedUser : {}, {}", id, involvedUser);
        if (involvedUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, involvedUser.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!involvedUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        InvolvedUser result = involvedUserRepository.save(involvedUser);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, involvedUser.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /involved-users/:id} : Partial updates given fields of an existing involvedUser, field will ignore if it is null
     *
     * @param id the id of the involvedUser to save.
     * @param involvedUser the involvedUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated involvedUser,
     * or with status {@code 400 (Bad Request)} if the involvedUser is not valid,
     * or with status {@code 404 (Not Found)} if the involvedUser is not found,
     * or with status {@code 500 (Internal Server Error)} if the involvedUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/involved-users/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<InvolvedUser> partialUpdateInvolvedUser(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody InvolvedUser involvedUser
    ) throws URISyntaxException {
        log.debug("REST request to partial update InvolvedUser partially : {}, {}", id, involvedUser);
        if (involvedUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, involvedUser.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!involvedUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<InvolvedUser> result = involvedUserRepository
            .findById(involvedUser.getId())
            .map(existingInvolvedUser -> {
                if (involvedUser.getExpertiseLevel() != null) {
                    existingInvolvedUser.setExpertiseLevel(involvedUser.getExpertiseLevel());
                }
                if (involvedUser.getUserRole() != null) {
                    existingInvolvedUser.setUserRole(involvedUser.getUserRole());
                }
                if (involvedUser.getIsModerator() != null) {
                    existingInvolvedUser.setIsModerator(involvedUser.getIsModerator());
                }
                if (involvedUser.getIsEligibleDM() != null) {
                    existingInvolvedUser.setIsEligibleDM(involvedUser.getIsEligibleDM());
                }

                return existingInvolvedUser;
            })
            .map(involvedUserRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, involvedUser.getId().toString())
        );
    }

    /**
     * {@code GET  /involved-users} : get all the involvedUsers.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of involvedUsers in body.
     */
    @GetMapping("/involved-users")
    public List<InvolvedUser> getAllInvolvedUsers(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all InvolvedUsers");
        if (eagerload) {
            return involvedUserRepository.findAllWithEagerRelationships();
        } else {
            return involvedUserRepository.findAll();
        }
    }

    /**
     * {@code GET  /involved-users/:id} : get the "id" involvedUser.
     *
     * @param id the id of the involvedUser to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the involvedUser, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/involved-users/{id}")
    public ResponseEntity<InvolvedUser> getInvolvedUser(@PathVariable Long id) {
        log.debug("REST request to get InvolvedUser : {}", id);
        Optional<InvolvedUser> involvedUser = involvedUserRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(involvedUser);
    }

    /**
     * {@code DELETE  /involved-users/:id} : delete the "id" involvedUser.
     *
     * @param id the id of the involvedUser to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/involved-users/{id}")
    public ResponseEntity<Void> deleteInvolvedUser(@PathVariable Long id) {
        log.debug("REST request to delete InvolvedUser : {}", id);
        involvedUserRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
