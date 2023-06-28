package fr.irit.csd.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import fr.irit.csd.domain.Solution;
import fr.irit.csd.repository.SolutionRepository;
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
 * REST controller for managing {@link fr.irit.csd.domain.Solution}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SolutionResource {

    private final Logger log = LoggerFactory.getLogger(SolutionResource.class);

    private static final String ENTITY_NAME = "solution";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SolutionRepository solutionRepository;

    public SolutionResource(SolutionRepository solutionRepository) {
        this.solutionRepository = solutionRepository;
    }

    /**
     * {@code POST  /solutions} : Create a new solution.
     *
     * @param solution the solution to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new solution, or with status {@code 400 (Bad Request)} if the solution has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/solutions")
    public ResponseEntity<Solution> createSolution(@RequestBody Solution solution) throws URISyntaxException {
        log.debug("REST request to save Solution : {}", solution);
        if (solution.getId() != null) {
            throw new BadRequestAlertException("A new solution cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Solution result = solutionRepository.save(solution);
        return ResponseEntity
            .created(new URI("/api/solutions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /solutions/:id} : Updates an existing solution.
     *
     * @param id the id of the solution to save.
     * @param solution the solution to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated solution,
     * or with status {@code 400 (Bad Request)} if the solution is not valid,
     * or with status {@code 500 (Internal Server Error)} if the solution couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/solutions/{id}")
    public ResponseEntity<Solution> updateSolution(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Solution solution
    ) throws URISyntaxException {
        log.debug("REST request to update Solution : {}, {}", id, solution);
        if (solution.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, solution.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!solutionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Solution result = solutionRepository.save(solution);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, solution.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /solutions/:id} : Partial updates given fields of an existing solution, field will ignore if it is null
     *
     * @param id the id of the solution to save.
     * @param solution the solution to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated solution,
     * or with status {@code 400 (Bad Request)} if the solution is not valid,
     * or with status {@code 404 (Not Found)} if the solution is not found,
     * or with status {@code 500 (Internal Server Error)} if the solution couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/solutions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Solution> partialUpdateSolution(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Solution solution
    ) throws URISyntaxException {
        log.debug("REST request to partial update Solution partially : {}, {}", id, solution);
        if (solution.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, solution.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!solutionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Solution> result = solutionRepository
            .findById(solution.getId())
            .map(existingSolution -> {
                if (solution.getName() != null) {
                    existingSolution.setName(solution.getName());
                }
                if (solution.getDescription() != null) {
                    existingSolution.setDescription(solution.getDescription());
                }

                return existingSolution;
            })
            .map(solutionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, solution.getId().toString())
        );
    }

    /**
     * {@code GET  /solutions} : get all the solutions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of solutions in body.
     */
    @GetMapping("/solutions")
    public List<Solution> getAllSolutions() {
        log.debug("REST request to get all Solutions");
        return solutionRepository.findAll();
    }

    /**
     * {@code GET  /solutions/:id} : get the "id" solution.
     *
     * @param id the id of the solution to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the solution, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/solutions/{id}")
    public ResponseEntity<Solution> getSolution(@PathVariable Long id) {
        log.debug("REST request to get Solution : {}", id);
        Optional<Solution> solution = solutionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(solution);
    }

    /**
     * {@code DELETE  /solutions/:id} : delete the "id" solution.
     *
     * @param id the id of the solution to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/solutions/{id}")
    public ResponseEntity<Void> deleteSolution(@PathVariable Long id) {
        log.debug("REST request to delete Solution : {}", id);
        solutionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
