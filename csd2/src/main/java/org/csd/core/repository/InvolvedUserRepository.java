package org.csd.core.repository;

import java.util.List;
import java.util.Optional;
import org.csd.core.domain.InvolvedUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the InvolvedUser entity.
 */
@Repository
public interface InvolvedUserRepository extends JpaRepository<InvolvedUser, Long> {
    default Optional<InvolvedUser> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<InvolvedUser> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<InvolvedUser> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct involvedUser from InvolvedUser involvedUser left join fetch involvedUser.user",
        countQuery = "select count(distinct involvedUser) from InvolvedUser involvedUser"
    )
    Page<InvolvedUser> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct involvedUser from InvolvedUser involvedUser left join fetch involvedUser.user")
    List<InvolvedUser> findAllWithToOneRelationships();

    @Query("select involvedUser from InvolvedUser involvedUser left join fetch involvedUser.user where involvedUser.id =:id")
    Optional<InvolvedUser> findOneWithToOneRelationships(@Param("id") Long id);
}
