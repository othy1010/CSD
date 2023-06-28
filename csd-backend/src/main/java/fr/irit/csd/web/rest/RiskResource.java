package fr.irit.csd.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import fr.irit.csd.domain.Risk;
import fr.irit.csd.repository.RiskRepository;
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
 * REST controller for managing {@link fr.irit.csd.domain.Risk}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RiskResource {

    private final Logger log = LoggerFactory.getLogger(RiskResource.class);

    private static final String ENTITY_NAME = "risk";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RiskRepository riskRepository;

    public RiskResource(RiskRepository riskRepository) {
        this.riskRepository = riskRepository;
    }

    /**
     * {@code POST  /risks} : Create a new risk.
     *
     * @param risk the risk to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new risk, or with status {@code 400 (Bad Request)} if the risk has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/risks")
    public ResponseEntity<Risk> createRisk(@RequestBody Risk risk) throws URISyntaxException {
        log.debug("REST request to save Risk : {}", risk);
        if (risk.getId() != null) {
            throw new BadRequestAlertException("A new risk cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Risk result = riskRepository.save(risk);
        return ResponseEntity
            .created(new URI("/api/risks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /risks/:id} : Updates an existing risk.
     *
     * @param id the id of the risk to save.
     * @param risk the risk to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated risk,
     * or with status {@code 400 (Bad Request)} if the risk is not valid,
     * or with status {@code 500 (Internal Server Error)} if the risk couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/risks/{id}")
    public ResponseEntity<Risk> updateRisk(@PathVariable(value = "id", required = false) final Long id, @RequestBody Risk risk)
        throws URISyntaxException {
        log.debug("REST request to update Risk : {}, {}", id, risk);
        if (risk.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, risk.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!riskRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Risk result = riskRepository.save(risk);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, risk.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /risks/:id} : Partial updates given fields of an existing risk, field will ignore if it is null
     *
     * @param id the id of the risk to save.
     * @param risk the risk to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated risk,
     * or with status {@code 400 (Bad Request)} if the risk is not valid,
     * or with status {@code 404 (Not Found)} if the risk is not found,
     * or with status {@code 500 (Internal Server Error)} if the risk couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/risks/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Risk> partialUpdateRisk(@PathVariable(value = "id", required = false) final Long id, @RequestBody Risk risk)
        throws URISyntaxException {
        log.debug("REST request to partial update Risk partially : {}, {}", id, risk);
        if (risk.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, risk.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!riskRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Risk> result = riskRepository
            .findById(risk.getId())
            .map(existingRisk -> {
                if (risk.getName() != null) {
                    existingRisk.setName(risk.getName());
                }
                if (risk.getDescription() != null) {
                    existingRisk.setDescription(risk.getDescription());
                }
                if (risk.getProbability() != null) {
                    existingRisk.setProbability(risk.getProbability());
                }
                if (risk.getImpactSeverity() != null) {
                    existingRisk.setImpactSeverity(risk.getImpactSeverity());
                }

                return existingRisk;
            })
            .map(riskRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, risk.getId().toString())
        );
    }

    /**
     * {@code GET  /risks} : get all the risks.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of risks in body.
     */
    @GetMapping("/risks")
    public List<Risk> getAllRisks() {
        log.debug("REST request to get all Risks");
        return riskRepository.findAll();
    }

    /**
     * {@code GET  /risks/:id} : get the "id" risk.
     *
     * @param id the id of the risk to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the risk, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/risks/{id}")
    public ResponseEntity<Risk> getRisk(@PathVariable Long id) {
        log.debug("REST request to get Risk : {}", id);
        Optional<Risk> risk = riskRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(risk);
    }

    /**
     * {@code DELETE  /risks/:id} : delete the "id" risk.
     *
     * @param id the id of the risk to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/risks/{id}")
    public ResponseEntity<Void> deleteRisk(@PathVariable Long id) {
        log.debug("REST request to delete Risk : {}", id);
        riskRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
