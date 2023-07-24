package org.csd.core.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.csd.core.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SelectionCriteriaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SelectionCriteria.class);
        SelectionCriteria selectionCriteria1 = new SelectionCriteria();
        selectionCriteria1.setId(1L);
        SelectionCriteria selectionCriteria2 = new SelectionCriteria();
        selectionCriteria2.setId(selectionCriteria1.getId());
        assertThat(selectionCriteria1).isEqualTo(selectionCriteria2);
        selectionCriteria2.setId(2L);
        assertThat(selectionCriteria1).isNotEqualTo(selectionCriteria2);
        selectionCriteria1.setId(null);
        assertThat(selectionCriteria1).isNotEqualTo(selectionCriteria2);
    }
}
