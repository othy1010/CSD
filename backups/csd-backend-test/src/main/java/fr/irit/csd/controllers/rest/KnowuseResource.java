package fr.irit.csd.controllers.rest;


import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import fr.irit.csd.domain.Knowuse;
import fr.irit.csd.repository.KnowuseRepository;
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
 * REST controller for managing {@link fr.irit.csd.domain.Knowuse}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class KnowuseResource {

    private final Logger log = LoggerFactory.getLogger(KnowuseResource.class);

    private static final String ENTITY_NAME = "knowuse";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final KnowuseRepository knowuseRepository;

    public KnowuseResource(KnowuseRepository knowuseRepository) {
        this.knowuseRepository = knowuseRepository;
    }

    /**
     * {@code POST  /knowuses} : Create a new knowuse.
     *
     * @param knowuse the knowuse to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new knowuse, or with status {@code 400 (Bad Request)} if the knowuse has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/knowuses")
    public ResponseEntity<Knowuse> createKnowuse(@RequestBody Knowuse knowuse) throws URISyntaxException {
        log.debug("REST request to save Knowuse : {}", knowuse);
        if (knowuse.getId() != null) {
            throw new BadRequestAlertException("A new knowuse cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Knowuse result = knowuseRepository.save(knowuse);
        return ResponseEntity
            .created(new URI("/api/knowuses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /knowuses/:id} : Updates an existing knowuse.
     *
     * @param id the id of the knowuse to save.
     * @param knowuse the knowuse to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated knowuse,
     * or with status {@code 400 (Bad Request)} if the knowuse is not valid,
     * or with status {@code 500 (Internal Server Error)} if the knowuse couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/knowuses/{id}")
    public ResponseEntity<Knowuse> updateKnowuse(@PathVariable(value = "id", required = false) final Long id, @RequestBody Knowuse knowuse)
        throws URISyntaxException {
        log.debug("REST request to update Knowuse : {}, {}", id, knowuse);
        if (knowuse.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, knowuse.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!knowuseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Knowuse result = knowuseRepository.save(knowuse);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, knowuse.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /knowuses/:id} : Partial updates given fields of an existing knowuse, field will ignore if it is null
     *
     * @param id the id of the knowuse to save.
     * @param knowuse the knowuse to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated knowuse,
     * or with status {@code 400 (Bad Request)} if the knowuse is not valid,
     * or with status {@code 404 (Not Found)} if the knowuse is not found,
     * or with status {@code 500 (Internal Server Error)} if the knowuse couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/knowuses/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Knowuse> partialUpdateKnowuse(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Knowuse knowuse
    ) throws URISyntaxException {
        log.debug("REST request to partial update Knowuse partially : {}, {}", id, knowuse);
        if (knowuse.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, knowuse.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!knowuseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Knowuse> result = knowuseRepository
            .findById(knowuse.getId())
            .map(existingKnowuse -> {
                if (knowuse.getName() != null) {
                    existingKnowuse.setName(knowuse.getName());
                }
                if (knowuse.getDescription() != null) {
                    existingKnowuse.setDescription(knowuse.getDescription());
                }

                return existingKnowuse;
            })
            .map(knowuseRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, knowuse.getId().toString())
        );
    }

    /**
     * {@code GET  /knowuses} : get all the knowuses.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of knowuses in body.
     */
    @GetMapping("/knowuses")
    public List<Knowuse> getAllKnowuses() {
        log.debug("REST request to get all Knowuses");
        return knowuseRepository.findAll();
    }

    /**
     * {@code GET  /knowuses/:id} : get the "id" knowuse.
     *
     * @param id the id of the knowuse to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the knowuse, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/knowuses/{id}")
    public ResponseEntity<Knowuse> getKnowuse(@PathVariable Long id) {
        log.debug("REST request to get Knowuse : {}", id);
        Optional<Knowuse> knowuse = knowuseRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(knowuse);
    }

    /**
     * {@code DELETE  /knowuses/:id} : delete the "id" knowuse.
     *
     * @param id the id of the knowuse to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/knowuses/{id}")
    public ResponseEntity<Void> deleteKnowuse(@PathVariable Long id) {
        log.debug("REST request to delete Knowuse : {}", id);
        knowuseRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
