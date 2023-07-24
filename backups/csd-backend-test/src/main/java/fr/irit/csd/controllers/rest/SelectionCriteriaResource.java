package fr.irit.csd.controllers.rest;


import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import fr.irit.csd.domain.SelectionCriteria;
import fr.irit.csd.repository.SelectionCriteriaRepository;
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
 * REST controller for managing {@link fr.irit.csd.domain.SelectionCriteria}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SelectionCriteriaResource {

    private final Logger log = LoggerFactory.getLogger(SelectionCriteriaResource.class);

    private static final String ENTITY_NAME = "selectionCriteria";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SelectionCriteriaRepository selectionCriteriaRepository;

    public SelectionCriteriaResource(SelectionCriteriaRepository selectionCriteriaRepository) {
        this.selectionCriteriaRepository = selectionCriteriaRepository;
    }

    /**
     * {@code POST  /selection-criteria} : Create a new selectionCriteria.
     *
     * @param selectionCriteria the selectionCriteria to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new selectionCriteria, or with status {@code 400 (Bad Request)} if the selectionCriteria has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/selection-criteria")
    public ResponseEntity<SelectionCriteria> createSelectionCriteria(@RequestBody SelectionCriteria selectionCriteria)
        throws URISyntaxException {
        log.debug("REST request to save SelectionCriteria : {}", selectionCriteria);
        if (selectionCriteria.getId() != null) {
            throw new BadRequestAlertException("A new selectionCriteria cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SelectionCriteria result = selectionCriteriaRepository.save(selectionCriteria);
        return ResponseEntity
            .created(new URI("/api/selection-criteria/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /selection-criteria/:id} : Updates an existing selectionCriteria.
     *
     * @param id the id of the selectionCriteria to save.
     * @param selectionCriteria the selectionCriteria to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated selectionCriteria,
     * or with status {@code 400 (Bad Request)} if the selectionCriteria is not valid,
     * or with status {@code 500 (Internal Server Error)} if the selectionCriteria couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/selection-criteria/{id}")
    public ResponseEntity<SelectionCriteria> updateSelectionCriteria(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SelectionCriteria selectionCriteria
    ) throws URISyntaxException {
        log.debug("REST request to update SelectionCriteria : {}, {}", id, selectionCriteria);
        if (selectionCriteria.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, selectionCriteria.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!selectionCriteriaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SelectionCriteria result = selectionCriteriaRepository.save(selectionCriteria);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, selectionCriteria.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /selection-criteria/:id} : Partial updates given fields of an existing selectionCriteria, field will ignore if it is null
     *
     * @param id the id of the selectionCriteria to save.
     * @param selectionCriteria the selectionCriteria to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated selectionCriteria,
     * or with status {@code 400 (Bad Request)} if the selectionCriteria is not valid,
     * or with status {@code 404 (Not Found)} if the selectionCriteria is not found,
     * or with status {@code 500 (Internal Server Error)} if the selectionCriteria couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/selection-criteria/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SelectionCriteria> partialUpdateSelectionCriteria(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SelectionCriteria selectionCriteria
    ) throws URISyntaxException {
        log.debug("REST request to partial update SelectionCriteria partially : {}, {}", id, selectionCriteria);
        if (selectionCriteria.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, selectionCriteria.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!selectionCriteriaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SelectionCriteria> result = selectionCriteriaRepository
            .findById(selectionCriteria.getId())
            .map(existingSelectionCriteria -> {
                if (selectionCriteria.getCriterion() != null) {
                    existingSelectionCriteria.setCriterion(selectionCriteria.getCriterion());
                }

                return existingSelectionCriteria;
            })
            .map(selectionCriteriaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, selectionCriteria.getId().toString())
        );
    }

    /**
     * {@code GET  /selection-criteria} : get all the selectionCriteria.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of selectionCriteria in body.
     */
    @GetMapping("/selection-criteria")
    public List<SelectionCriteria> getAllSelectionCriteria() {
        log.debug("REST request to get all SelectionCriteria");
        return selectionCriteriaRepository.findAll();
    }

    /**
     * {@code GET  /selection-criteria/:id} : get the "id" selectionCriteria.
     *
     * @param id the id of the selectionCriteria to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the selectionCriteria, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/selection-criteria/{id}")
    public ResponseEntity<SelectionCriteria> getSelectionCriteria(@PathVariable Long id) {
        log.debug("REST request to get SelectionCriteria : {}", id);
        Optional<SelectionCriteria> selectionCriteria = selectionCriteriaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(selectionCriteria);
    }

    /**
     * {@code DELETE  /selection-criteria/:id} : delete the "id" selectionCriteria.
     *
     * @param id the id of the selectionCriteria to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/selection-criteria/{id}")
    public ResponseEntity<Void> deleteSelectionCriteria(@PathVariable Long id) {
        log.debug("REST request to delete SelectionCriteria : {}", id);
        selectionCriteriaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
