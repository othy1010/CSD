package fr.irit.csd.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import fr.irit.csd.domain.Decision;
import fr.irit.csd.repository.DecisionRepository;
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
 * REST controller for managing {@link fr.irit.csd.domain.Decision}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DecisionResource {

    private final Logger log = LoggerFactory.getLogger(DecisionResource.class);

    private static final String ENTITY_NAME = "decision";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DecisionRepository decisionRepository;

    public DecisionResource(DecisionRepository decisionRepository) {
        this.decisionRepository = decisionRepository;
    }

    /**
     * {@code POST  /decisions} : Create a new decision.
     *
     * @param decision the decision to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new decision, or with status {@code 400 (Bad Request)} if the decision has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/decisions")
    public ResponseEntity<Decision> createDecision(@Valid @RequestBody Decision decision) throws URISyntaxException {
        log.debug("REST request to save Decision : {}", decision);
        if (decision.getId() != null) {
            throw new BadRequestAlertException("A new decision cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Decision result = decisionRepository.save(decision);
        return ResponseEntity
            .created(new URI("/api/decisions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /decisions/:id} : Updates an existing decision.
     *
     * @param id the id of the decision to save.
     * @param decision the decision to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated decision,
     * or with status {@code 400 (Bad Request)} if the decision is not valid,
     * or with status {@code 500 (Internal Server Error)} if the decision couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/decisions/{id}")
    public ResponseEntity<Decision> updateDecision(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Decision decision
    ) throws URISyntaxException {
        log.debug("REST request to update Decision : {}, {}", id, decision);
        if (decision.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, decision.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!decisionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Decision result = decisionRepository.save(decision);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, decision.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /decisions/:id} : Partial updates given fields of an existing decision, field will ignore if it is null
     *
     * @param id the id of the decision to save.
     * @param decision the decision to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated decision,
     * or with status {@code 400 (Bad Request)} if the decision is not valid,
     * or with status {@code 404 (Not Found)} if the decision is not found,
     * or with status {@code 500 (Internal Server Error)} if the decision couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/decisions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Decision> partialUpdateDecision(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Decision decision
    ) throws URISyntaxException {
        log.debug("REST request to partial update Decision partially : {}, {}", id, decision);
        if (decision.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, decision.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!decisionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Decision> result = decisionRepository
            .findById(decision.getId())
            .map(existingDecision -> {
                if (decision.getAgreement() != null) {
                    existingDecision.setAgreement(decision.getAgreement());
                }
                if (decision.getComment() != null) {
                    existingDecision.setComment(decision.getComment());
                }

                return existingDecision;
            })
            .map(decisionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, decision.getId().toString())
        );
    }

    /**
     * {@code GET  /decisions} : get all the decisions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of decisions in body.
     */
    @GetMapping("/decisions")
    public List<Decision> getAllDecisions() {
        log.debug("REST request to get all Decisions");
        return decisionRepository.findAll();
    }

    /**
     * {@code GET  /decisions/:id} : get the "id" decision.
     *
     * @param id the id of the decision to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the decision, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/decisions/{id}")
    public ResponseEntity<Decision> getDecision(@PathVariable Long id) {
        log.debug("REST request to get Decision : {}", id);
        Optional<Decision> decision = decisionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(decision);
    }

    /**
     * {@code DELETE  /decisions/:id} : delete the "id" decision.
     *
     * @param id the id of the decision to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/decisions/{id}")
    public ResponseEntity<Void> deleteDecision(@PathVariable Long id) {
        log.debug("REST request to delete Decision : {}", id);
        decisionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
