package fr.irit.csd.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import fr.irit.csd.domain.ParticipationMethod;
import fr.irit.csd.repository.ParticipationMethodRepository;
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
 * REST controller for managing {@link fr.irit.csd.domain.ParticipationMethod}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ParticipationMethodResource {

    private final Logger log = LoggerFactory.getLogger(ParticipationMethodResource.class);

    private static final String ENTITY_NAME = "participationMethod";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ParticipationMethodRepository participationMethodRepository;

    public ParticipationMethodResource(ParticipationMethodRepository participationMethodRepository) {
        this.participationMethodRepository = participationMethodRepository;
    }

    /**
     * {@code POST  /participation-methods} : Create a new participationMethod.
     *
     * @param participationMethod the participationMethod to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new participationMethod, or with status {@code 400 (Bad Request)} if the participationMethod has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/participation-methods")
    public ResponseEntity<ParticipationMethod> createParticipationMethod(@Valid @RequestBody ParticipationMethod participationMethod)
        throws URISyntaxException {
        log.debug("REST request to save ParticipationMethod : {}", participationMethod);
        if (participationMethod.getId() != null) {
            throw new BadRequestAlertException("A new participationMethod cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ParticipationMethod result = participationMethodRepository.save(participationMethod);
        return ResponseEntity
            .created(new URI("/api/participation-methods/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /participation-methods/:id} : Updates an existing participationMethod.
     *
     * @param id the id of the participationMethod to save.
     * @param participationMethod the participationMethod to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated participationMethod,
     * or with status {@code 400 (Bad Request)} if the participationMethod is not valid,
     * or with status {@code 500 (Internal Server Error)} if the participationMethod couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/participation-methods/{id}")
    public ResponseEntity<ParticipationMethod> updateParticipationMethod(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ParticipationMethod participationMethod
    ) throws URISyntaxException {
        log.debug("REST request to update ParticipationMethod : {}, {}", id, participationMethod);
        if (participationMethod.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, participationMethod.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!participationMethodRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ParticipationMethod result = participationMethodRepository.save(participationMethod);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, participationMethod.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /participation-methods/:id} : Partial updates given fields of an existing participationMethod, field will ignore if it is null
     *
     * @param id the id of the participationMethod to save.
     * @param participationMethod the participationMethod to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated participationMethod,
     * or with status {@code 400 (Bad Request)} if the participationMethod is not valid,
     * or with status {@code 404 (Not Found)} if the participationMethod is not found,
     * or with status {@code 500 (Internal Server Error)} if the participationMethod couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/participation-methods/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ParticipationMethod> partialUpdateParticipationMethod(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ParticipationMethod participationMethod
    ) throws URISyntaxException {
        log.debug("REST request to partial update ParticipationMethod partially : {}, {}", id, participationMethod);
        if (participationMethod.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, participationMethod.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!participationMethodRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ParticipationMethod> result = participationMethodRepository
            .findById(participationMethod.getId())
            .map(existingParticipationMethod -> {
                if (participationMethod.getType() != null) {
                    existingParticipationMethod.setType(participationMethod.getType());
                }

                return existingParticipationMethod;
            })
            .map(participationMethodRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, participationMethod.getId().toString())
        );
    }

    /**
     * {@code GET  /participation-methods} : get all the participationMethods.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of participationMethods in body.
     */
    @GetMapping("/participation-methods")
    public List<ParticipationMethod> getAllParticipationMethods() {
        log.debug("REST request to get all ParticipationMethods");
        return participationMethodRepository.findAll();
    }

    /**
     * {@code GET  /participation-methods/:id} : get the "id" participationMethod.
     *
     * @param id the id of the participationMethod to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the participationMethod, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/participation-methods/{id}")
    public ResponseEntity<ParticipationMethod> getParticipationMethod(@PathVariable Long id) {
        log.debug("REST request to get ParticipationMethod : {}", id);
        Optional<ParticipationMethod> participationMethod = participationMethodRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(participationMethod);
    }

    /**
     * {@code DELETE  /participation-methods/:id} : delete the "id" participationMethod.
     *
     * @param id the id of the participationMethod to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/participation-methods/{id}")
    public ResponseEntity<Void> deleteParticipationMethod(@PathVariable Long id) {
        log.debug("REST request to delete ParticipationMethod : {}", id);
        participationMethodRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
