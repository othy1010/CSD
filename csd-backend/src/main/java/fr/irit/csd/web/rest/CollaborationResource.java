package fr.irit.csd.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import fr.irit.csd.domain.Collaboration;
import fr.irit.csd.repository.CollaborationRepository;
import fr.irit.csd.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link fr.irit.csd.domain.Collaboration}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CollaborationResource {

    private final Logger log = LoggerFactory.getLogger(CollaborationResource.class);

    private static final String ENTITY_NAME = "collaboration";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CollaborationRepository collaborationRepository;

    public CollaborationResource(CollaborationRepository collaborationRepository) {
        this.collaborationRepository = collaborationRepository;
    }

    /**
     * {@code POST  /collaborations} : Create a new collaboration.
     *
     * @param collaboration the collaboration to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new collaboration, or with status {@code 400 (Bad Request)} if the collaboration has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/collaborations")
    public ResponseEntity<Collaboration> createCollaboration(@RequestBody Collaboration collaboration) throws URISyntaxException {
        log.debug("REST request to save Collaboration : {}", collaboration);
        if (collaboration.getId() != null) {
            throw new BadRequestAlertException("A new collaboration cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Collaboration result = collaborationRepository.save(collaboration);
        return ResponseEntity
            .created(new URI("/api/collaborations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /collaborations/:id} : Updates an existing collaboration.
     *
     * @param id the id of the collaboration to save.
     * @param collaboration the collaboration to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated collaboration,
     * or with status {@code 400 (Bad Request)} if the collaboration is not valid,
     * or with status {@code 500 (Internal Server Error)} if the collaboration couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/collaborations/{id}")
    public ResponseEntity<Collaboration> updateCollaboration(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Collaboration collaboration
    ) throws URISyntaxException {
        log.debug("REST request to update Collaboration : {}, {}", id, collaboration);
        if (collaboration.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, collaboration.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!collaborationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Collaboration result = collaborationRepository.save(collaboration);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, collaboration.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /collaborations/:id} : Partial updates given fields of an existing collaboration, field will ignore if it is null
     *
     * @param id the id of the collaboration to save.
     * @param collaboration the collaboration to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated collaboration,
     * or with status {@code 400 (Bad Request)} if the collaboration is not valid,
     * or with status {@code 404 (Not Found)} if the collaboration is not found,
     * or with status {@code 500 (Internal Server Error)} if the collaboration couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/collaborations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Collaboration> partialUpdateCollaboration(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Collaboration collaboration
    ) throws URISyntaxException {
        log.debug("REST request to partial update Collaboration partially : {}, {}", id, collaboration);
        if (collaboration.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, collaboration.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!collaborationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Collaboration> result = collaborationRepository
            .findById(collaboration.getId())
            .map(existingCollaboration -> {
                if (collaboration.getName() != null) {
                    existingCollaboration.setName(collaboration.getName());
                }
                if (collaboration.getDescription() != null) {
                    existingCollaboration.setDescription(collaboration.getDescription());
                }
                if (collaboration.getStartDate() != null) {
                    existingCollaboration.setStartDate(collaboration.getStartDate());
                }
                if (collaboration.getDecisionDuration() != null) {
                    existingCollaboration.setDecisionDuration(collaboration.getDecisionDuration());
                }
                if (collaboration.getEvaluationDuration() != null) {
                    existingCollaboration.setEvaluationDuration(collaboration.getEvaluationDuration());
                }
                if (collaboration.getCollaborationState() != null) {
                    existingCollaboration.setCollaborationState(collaboration.getCollaborationState());
                }

                return existingCollaboration;
            })
            .map(collaborationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, collaboration.getId().toString())
        );
    }

    /**
     * {@code GET  /collaborations} : get all the collaborations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of collaborations in body.
     */
    @GetMapping("/collaborations")
    public List<Collaboration> getAllCollaborations() {
        log.debug("REST request to get all Collaborations");
        return collaborationRepository.findAll();
    }

    /**
     * {@code GET  /collaborations/:id} : get the "id" collaboration.
     *
     * @param id the id of the collaboration to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the collaboration, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/collaborations/{id}")
    public ResponseEntity<Collaboration> getCollaboration(@PathVariable Long id) {
        log.debug("REST request to get Collaboration : {}", id);
        Optional<Collaboration> collaboration = collaborationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(collaboration);
    }

    /**
     * {@code DELETE  /collaborations/:id} : delete the "id" collaboration.
     *
     * @param id the id of the collaboration to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/collaborations/{id}")
    public ResponseEntity<Void> deleteCollaboration(@PathVariable Long id) {
        log.debug("REST request to delete Collaboration : {}", id);
        collaborationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
