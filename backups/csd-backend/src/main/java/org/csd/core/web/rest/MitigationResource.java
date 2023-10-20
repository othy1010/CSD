package org.csd.core.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.csd.core.domain.Mitigation;
import org.csd.core.repository.MitigationRepository;
import org.csd.core.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.csd.core.domain.Mitigation}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MitigationResource {

    private final Logger log = LoggerFactory.getLogger(MitigationResource.class);

    private static final String ENTITY_NAME = "mitigation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MitigationRepository mitigationRepository;

    public MitigationResource(MitigationRepository mitigationRepository) {
        this.mitigationRepository = mitigationRepository;
    }

    /**
     * {@code POST  /mitigations} : Create a new mitigation.
     *
     * @param mitigation the mitigation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mitigation, or with status {@code 400 (Bad Request)} if the mitigation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mitigations")
    public ResponseEntity<Mitigation> createMitigation(@Valid @RequestBody Mitigation mitigation) throws URISyntaxException {
        log.debug("REST request to save Mitigation : {}", mitigation);
        if (mitigation.getId() != null) {
            throw new BadRequestAlertException("A new mitigation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Mitigation result = mitigationRepository.save(mitigation);
        return ResponseEntity
            .created(new URI("/api/mitigations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mitigations/:id} : Updates an existing mitigation.
     *
     * @param id the id of the mitigation to save.
     * @param mitigation the mitigation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mitigation,
     * or with status {@code 400 (Bad Request)} if the mitigation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mitigation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mitigations/{id}")
    public ResponseEntity<Mitigation> updateMitigation(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Mitigation mitigation
    ) throws URISyntaxException {
        log.debug("REST request to update Mitigation : {}, {}", id, mitigation);
        if (mitigation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mitigation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mitigationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Mitigation result = mitigationRepository.save(mitigation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mitigation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /mitigations/:id} : Partial updates given fields of an existing mitigation, field will ignore if it is null
     *
     * @param id the id of the mitigation to save.
     * @param mitigation the mitigation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mitigation,
     * or with status {@code 400 (Bad Request)} if the mitigation is not valid,
     * or with status {@code 404 (Not Found)} if the mitigation is not found,
     * or with status {@code 500 (Internal Server Error)} if the mitigation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/mitigations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Mitigation> partialUpdateMitigation(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Mitigation mitigation
    ) throws URISyntaxException {
        log.debug("REST request to partial update Mitigation partially : {}, {}", id, mitigation);
        if (mitigation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mitigation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mitigationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Mitigation> result = mitigationRepository
            .findById(mitigation.getId())
            .map(existingMitigation -> {
                return existingMitigation;
            })
            .map(mitigationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mitigation.getId().toString())
        );
    }

    /**
     * {@code GET  /mitigations} : get all the mitigations.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mitigations in body.
     */
    @GetMapping("/mitigations")
    public List<Mitigation> getAllMitigations(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Mitigations");
        if (eagerload) {
            return mitigationRepository.findAllWithEagerRelationships();
        } else {
            return mitigationRepository.findAll();
        }
    }

    /**
     * {@code GET  /mitigations/:id} : get the "id" mitigation.
     *
     * @param id the id of the mitigation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mitigation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mitigations/{id}")
    public ResponseEntity<Mitigation> getMitigation(@PathVariable Long id) {
        log.debug("REST request to get Mitigation : {}", id);
        Optional<Mitigation> mitigation = mitigationRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(mitigation);
    }

    /**
     * {@code DELETE  /mitigations/:id} : delete the "id" mitigation.
     *
     * @param id the id of the mitigation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mitigations/{id}")
    public ResponseEntity<Void> deleteMitigation(@PathVariable Long id) {
        log.debug("REST request to delete Mitigation : {}", id);
        mitigationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
