package org.csd.core.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.csd.core.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DecisionPatternTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DecisionPattern.class);
        DecisionPattern decisionPattern1 = new DecisionPattern();
        decisionPattern1.setId(1L);
        DecisionPattern decisionPattern2 = new DecisionPattern();
        decisionPattern2.setId(decisionPattern1.getId());
        assertThat(decisionPattern1).isEqualTo(decisionPattern2);
        decisionPattern2.setId(2L);
        assertThat(decisionPattern1).isNotEqualTo(decisionPattern2);
        decisionPattern1.setId(null);
        assertThat(decisionPattern1).isNotEqualTo(decisionPattern2);
    }
}
