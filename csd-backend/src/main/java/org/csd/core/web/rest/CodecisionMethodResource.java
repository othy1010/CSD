package org.csd.core.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.csd.core.domain.CodecisionMethod;
import org.csd.core.repository.CodecisionMethodRepository;
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
 * REST controller for managing {@link org.csd.core.domain.CodecisionMethod}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CodecisionMethodResource {

    private final Logger log = LoggerFactory.getLogger(CodecisionMethodResource.class);

    private static final String ENTITY_NAME = "codecisionMethod";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CodecisionMethodRepository codecisionMethodRepository;

    public CodecisionMethodResource(CodecisionMethodRepository codecisionMethodRepository) {
        this.codecisionMethodRepository = codecisionMethodRepository;
    }

    /**
     * {@code POST  /codecision-methods} : Create a new codecisionMethod.
     *
     * @param codecisionMethod the codecisionMethod to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new codecisionMethod, or with status {@code 400 (Bad Request)} if the codecisionMethod has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/codecision-methods")
    public ResponseEntity<CodecisionMethod> createCodecisionMethod(@RequestBody CodecisionMethod codecisionMethod)
        throws URISyntaxException {
        log.debug("REST request to save CodecisionMethod : {}", codecisionMethod);
        if (codecisionMethod.getId() != null) {
            throw new BadRequestAlertException("A new codecisionMethod cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CodecisionMethod result = codecisionMethodRepository.save(codecisionMethod);
        return ResponseEntity
            .created(new URI("/api/codecision-methods/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /codecision-methods/:id} : Updates an existing codecisionMethod.
     *
     * @param id the id of the codecisionMethod to save.
     * @param codecisionMethod the codecisionMethod to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated codecisionMethod,
     * or with status {@code 400 (Bad Request)} if the codecisionMethod is not valid,
     * or with status {@code 500 (Internal Server Error)} if the codecisionMethod couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/codecision-methods/{id}")
    public ResponseEntity<CodecisionMethod> updateCodecisionMethod(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CodecisionMethod codecisionMethod
    ) throws URISyntaxException {
        log.debug("REST request to update CodecisionMethod : {}, {}", id, codecisionMethod);
        if (codecisionMethod.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, codecisionMethod.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!codecisionMethodRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CodecisionMethod result = codecisionMethodRepository.save(codecisionMethod);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, codecisionMethod.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /codecision-methods/:id} : Partial updates given fields of an existing codecisionMethod, field will ignore if it is null
     *
     * @param id the id of the codecisionMethod to save.
     * @param codecisionMethod the codecisionMethod to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated codecisionMethod,
     * or with status {@code 400 (Bad Request)} if the codecisionMethod is not valid,
     * or with status {@code 404 (Not Found)} if the codecisionMethod is not found,
     * or with status {@code 500 (Internal Server Error)} if the codecisionMethod couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/codecision-methods/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CodecisionMethod> partialUpdateCodecisionMethod(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CodecisionMethod codecisionMethod
    ) throws URISyntaxException {
        log.debug("REST request to partial update CodecisionMethod partially : {}, {}", id, codecisionMethod);
        if (codecisionMethod.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, codecisionMethod.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!codecisionMethodRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CodecisionMethod> result = codecisionMethodRepository
            .findById(codecisionMethod.getId())
            .map(existingCodecisionMethod -> {
                if (codecisionMethod.getProcessKind() != null) {
                    existingCodecisionMethod.setProcessKind(codecisionMethod.getProcessKind());
                }
                if (codecisionMethod.getEvaluationKind() != null) {
                    existingCodecisionMethod.setEvaluationKind(codecisionMethod.getEvaluationKind());
                }
                if (codecisionMethod.getAgreementThreshold() != null) {
                    existingCodecisionMethod.setAgreementThreshold(codecisionMethod.getAgreementThreshold());
                }

                return existingCodecisionMethod;
            })
            .map(codecisionMethodRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, codecisionMethod.getId().toString())
        );
    }

    /**
     * {@code GET  /codecision-methods} : get all the codecisionMethods.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of codecisionMethods in body.
     */
    @GetMapping("/codecision-methods")
    public List<CodecisionMethod> getAllCodecisionMethods() {
        log.debug("REST request to get all CodecisionMethods");
        return codecisionMethodRepository.findAll();
    }

    /**
     * {@code GET  /codecision-methods/:id} : get the "id" codecisionMethod.
     *
     * @param id the id of the codecisionMethod to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the codecisionMethod, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/codecision-methods/{id}")
    public ResponseEntity<CodecisionMethod> getCodecisionMethod(@PathVariable Long id) {
        log.debug("REST request to get CodecisionMethod : {}", id);
        Optional<CodecisionMethod> codecisionMethod = codecisionMethodRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(codecisionMethod);
    }

    /**
     * {@code DELETE  /codecision-methods/:id} : delete the "id" codecisionMethod.
     *
     * @param id the id of the codecisionMethod to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/codecision-methods/{id}")
    public ResponseEntity<Void> deleteCodecisionMethod(@PathVariable Long id) {
        log.debug("REST request to delete CodecisionMethod : {}", id);
        codecisionMethodRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
