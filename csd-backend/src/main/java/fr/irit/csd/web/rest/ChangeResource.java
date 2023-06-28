package fr.irit.csd.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import fr.irit.csd.domain.Change;
import fr.irit.csd.repository.ChangeRepository;
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
 * REST controller for managing {@link fr.irit.csd.domain.Change}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ChangeResource {

    private final Logger log = LoggerFactory.getLogger(ChangeResource.class);

    private static final String ENTITY_NAME = "change";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChangeRepository changeRepository;

    public ChangeResource(ChangeRepository changeRepository) {
        this.changeRepository = changeRepository;
    }

    /**
     * {@code POST  /changes} : Create a new change.
     *
     * @param change the change to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new change, or with status {@code 400 (Bad Request)} if the change has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/changes")
    public ResponseEntity<Change> createChange(@RequestBody Change change) throws URISyntaxException {
        log.debug("REST request to save Change : {}", change);
        if (change.getId() != null) {
            throw new BadRequestAlertException("A new change cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Change result = changeRepository.save(change);
        return ResponseEntity
            .created(new URI("/api/changes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /changes/:id} : Updates an existing change.
     *
     * @param id the id of the change to save.
     * @param change the change to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated change,
     * or with status {@code 400 (Bad Request)} if the change is not valid,
     * or with status {@code 500 (Internal Server Error)} if the change couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/changes/{id}")
    public ResponseEntity<Change> updateChange(@PathVariable(value = "id", required = false) final Long id, @RequestBody Change change)
        throws URISyntaxException {
        log.debug("REST request to update Change : {}, {}", id, change);
        if (change.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, change.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!changeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Change result = changeRepository.save(change);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, change.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /changes/:id} : Partial updates given fields of an existing change, field will ignore if it is null
     *
     * @param id the id of the change to save.
     * @param change the change to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated change,
     * or with status {@code 400 (Bad Request)} if the change is not valid,
     * or with status {@code 404 (Not Found)} if the change is not found,
     * or with status {@code 500 (Internal Server Error)} if the change couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/changes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Change> partialUpdateChange(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Change change
    ) throws URISyntaxException {
        log.debug("REST request to partial update Change partially : {}, {}", id, change);
        if (change.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, change.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!changeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Change> result = changeRepository
            .findById(change.getId())
            .map(existingChange -> {
                if (change.getType() != null) {
                    existingChange.setType(change.getType());
                }
                if (change.getRefId() != null) {
                    existingChange.setRefId(change.getRefId());
                }

                return existingChange;
            })
            .map(changeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, change.getId().toString())
        );
    }

    /**
     * {@code GET  /changes} : get all the changes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of changes in body.
     */
    @GetMapping("/changes")
    public List<Change> getAllChanges() {
        log.debug("REST request to get all Changes");
        return changeRepository.findAll();
    }

    /**
     * {@code GET  /changes/:id} : get the "id" change.
     *
     * @param id the id of the change to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the change, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/changes/{id}")
    public ResponseEntity<Change> getChange(@PathVariable Long id) {
        log.debug("REST request to get Change : {}", id);
        Optional<Change> change = changeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(change);
    }

    /**
     * {@code DELETE  /changes/:id} : delete the "id" change.
     *
     * @param id the id of the change to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/changes/{id}")
    public ResponseEntity<Void> deleteChange(@PathVariable Long id) {
        log.debug("REST request to delete Change : {}", id);
        changeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
