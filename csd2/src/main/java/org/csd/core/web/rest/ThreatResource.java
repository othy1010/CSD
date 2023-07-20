package org.csd.core.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.csd.core.domain.Threat;
import org.csd.core.repository.ThreatRepository;
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
 * REST controller for managing {@link org.csd.core.domain.Threat}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ThreatResource {

    private final Logger log = LoggerFactory.getLogger(ThreatResource.class);

    private static final String ENTITY_NAME = "threat";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ThreatRepository threatRepository;

    public ThreatResource(ThreatRepository threatRepository) {
        this.threatRepository = threatRepository;
    }

    /**
     * {@code POST  /threats} : Create a new threat.
     *
     * @param threat the threat to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new threat, or with status {@code 400 (Bad Request)} if the threat has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/threats")
    public ResponseEntity<Threat> createThreat(@RequestBody Threat threat) throws URISyntaxException {
        log.debug("REST request to save Threat : {}", threat);
        if (threat.getId() != null) {
            throw new BadRequestAlertException("A new threat cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Threat result = threatRepository.save(threat);
        return ResponseEntity
            .created(new URI("/api/threats/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /threats/:id} : Updates an existing threat.
     *
     * @param id the id of the threat to save.
     * @param threat the threat to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated threat,
     * or with status {@code 400 (Bad Request)} if the threat is not valid,
     * or with status {@code 500 (Internal Server Error)} if the threat couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/threats/{id}")
    public ResponseEntity<Threat> updateThreat(@PathVariable(value = "id", required = false) final Long id, @RequestBody Threat threat)
        throws URISyntaxException {
        log.debug("REST request to update Threat : {}, {}", id, threat);
        if (threat.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, threat.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!threatRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Threat result = threatRepository.save(threat);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, threat.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /threats/:id} : Partial updates given fields of an existing threat, field will ignore if it is null
     *
     * @param id the id of the threat to save.
     * @param threat the threat to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated threat,
     * or with status {@code 400 (Bad Request)} if the threat is not valid,
     * or with status {@code 404 (Not Found)} if the threat is not found,
     * or with status {@code 500 (Internal Server Error)} if the threat couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/threats/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Threat> partialUpdateThreat(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Threat threat
    ) throws URISyntaxException {
        log.debug("REST request to partial update Threat partially : {}, {}", id, threat);
        if (threat.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, threat.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!threatRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Threat> result = threatRepository
            .findById(threat.getId())
            .map(existingThreat -> {
                if (threat.getName() != null) {
                    existingThreat.setName(threat.getName());
                }
                if (threat.getDescription() != null) {
                    existingThreat.setDescription(threat.getDescription());
                }
                if (threat.getProbability() != null) {
                    existingThreat.setProbability(threat.getProbability());
                }
                if (threat.getReference() != null) {
                    existingThreat.setReference(threat.getReference());
                }
                if (threat.getRefId() != null) {
                    existingThreat.setRefId(threat.getRefId());
                }

                return existingThreat;
            })
            .map(threatRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, threat.getId().toString())
        );
    }

    /**
     * {@code GET  /threats} : get all the threats.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of threats in body.
     */
    @GetMapping("/threats")
    public List<Threat> getAllThreats(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Threats");
        if (eagerload) {
            return threatRepository.findAllWithEagerRelationships();
        } else {
            return threatRepository.findAll();
        }
    }

    /**
     * {@code GET  /threats/:id} : get the "id" threat.
     *
     * @param id the id of the threat to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the threat, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/threats/{id}")
    public ResponseEntity<Threat> getThreat(@PathVariable Long id) {
        log.debug("REST request to get Threat : {}", id);
        Optional<Threat> threat = threatRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(threat);
    }

    /**
     * {@code DELETE  /threats/:id} : delete the "id" threat.
     *
     * @param id the id of the threat to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/threats/{id}")
    public ResponseEntity<Void> deleteThreat(@PathVariable Long id) {
        log.debug("REST request to delete Threat : {}", id);
        threatRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
