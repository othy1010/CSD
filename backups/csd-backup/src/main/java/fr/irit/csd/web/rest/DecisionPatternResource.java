package fr.irit.csd.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import fr.irit.csd.domain.DecisionPattern;
import fr.irit.csd.repository.DecisionPatternRepository;
import fr.irit.csd.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import fr.irit.csd.web.rest.errors.HeaderUtil;
import fr.irit.csd.web.rest.errors.ResponseUtil;

/**
 * REST controller for managing {@link fr.irit.csd.domain.DecisionPattern}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DecisionPatternResource {

    private final Logger log = LoggerFactory.getLogger(DecisionPatternResource.class);

    private static final String ENTITY_NAME = "decisionPattern";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DecisionPatternRepository decisionPatternRepository;

    public DecisionPatternResource(DecisionPatternRepository decisionPatternRepository) {
        this.decisionPatternRepository = decisionPatternRepository;
    }

    /**
     * {@code POST  /decision-patterns} : Create a new decisionPattern.
     *
     * @param decisionPattern the decisionPattern to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new decisionPattern, or with status {@code 400 (Bad Request)} if the decisionPattern has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/decision-patterns")
    public ResponseEntity<DecisionPattern> createDecisionPattern(@Valid @RequestBody DecisionPattern decisionPattern)
        throws URISyntaxException {
        log.debug("REST request to save DecisionPattern : {}", decisionPattern);
        if (decisionPattern.getId() != null) {
            throw new BadRequestAlertException("A new decisionPattern cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DecisionPattern result = decisionPatternRepository.save(decisionPattern);
        return ResponseEntity
            .created(new URI("/api/decision-patterns/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /decision-patterns/:id} : Updates an existing decisionPattern.
     *
     * @param id the id of the decisionPattern to save.
     * @param decisionPattern the decisionPattern to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated decisionPattern,
     * or with status {@code 400 (Bad Request)} if the decisionPattern is not valid,
     * or with status {@code 500 (Internal Server Error)} if the decisionPattern couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/decision-patterns/{id}")
    public ResponseEntity<DecisionPattern> updateDecisionPattern(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody DecisionPattern decisionPattern
    ) throws URISyntaxException {
        log.debug("REST request to update DecisionPattern : {}, {}", id, decisionPattern);
        if (decisionPattern.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, decisionPattern.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!decisionPatternRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DecisionPattern result = decisionPatternRepository.save(decisionPattern);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, decisionPattern.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /decision-patterns/:id} : Partial updates given fields of an existing decisionPattern, field will ignore if it is null
     *
     * @param id the id of the decisionPattern to save.
     * @param decisionPattern the decisionPattern to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated decisionPattern,
     * or with status {@code 400 (Bad Request)} if the decisionPattern is not valid,
     * or with status {@code 404 (Not Found)} if the decisionPattern is not found,
     * or with status {@code 500 (Internal Server Error)} if the decisionPattern couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/decision-patterns/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DecisionPattern> partialUpdateDecisionPattern(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody DecisionPattern decisionPattern
    ) throws URISyntaxException {
        log.debug("REST request to partial update DecisionPattern partially : {}, {}", id, decisionPattern);
        if (decisionPattern.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, decisionPattern.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!decisionPatternRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DecisionPattern> result = decisionPatternRepository
            .findById(decisionPattern.getId())
            .map(existingDecisionPattern -> {
                if (decisionPattern.getName() != null) {
                    existingDecisionPattern.setName(decisionPattern.getName());
                }
                if (decisionPattern.getDescription() != null) {
                    existingDecisionPattern.setDescription(decisionPattern.getDescription());
                }

                return existingDecisionPattern;
            })
            .map(decisionPatternRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, decisionPattern.getId().toString())
        );
    }

    /**
     * {@code GET  /decision-patterns} : get all the decisionPatterns.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of decisionPatterns in body.
     */
    @GetMapping("/decision-patterns")
    public List<DecisionPattern> getAllDecisionPatterns() {
        log.debug("REST request to get all DecisionPatterns");
        return decisionPatternRepository.findAll();
    }

    /**
     * {@code GET  /decision-patterns/:id} : get the "id" decisionPattern.
     *
     * @param id the id of the decisionPattern to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the decisionPattern, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/decision-patterns/{id}")
    public ResponseEntity<DecisionPattern> getDecisionPattern(@PathVariable Long id) {
        log.debug("REST request to get DecisionPattern : {}", id);
        Optional<DecisionPattern> decisionPattern = decisionPatternRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(decisionPattern);
    }

    /**
     * {@code DELETE  /decision-patterns/:id} : delete the "id" decisionPattern.
     *
     * @param id the id of the decisionPattern to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/decision-patterns/{id}")
    public ResponseEntity<Void> deleteDecisionPattern(@PathVariable Long id) {
        log.debug("REST request to delete DecisionPattern : {}", id);
        decisionPatternRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
