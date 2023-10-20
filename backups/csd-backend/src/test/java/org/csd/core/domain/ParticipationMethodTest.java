package org.csd.core.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.csd.core.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ParticipationMethodTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ParticipationMethod.class);
        ParticipationMethod participationMethod1 = new ParticipationMethod();
        participationMethod1.setId(1L);
        ParticipationMethod participationMethod2 = new ParticipationMethod();
        participationMethod2.setId(participationMethod1.getId());
        assertThat(participationMethod1).isEqualTo(participationMethod2);
        participationMethod2.setId(2L);
        assertThat(participationMethod1).isNotEqualTo(participationMethod2);
        participationMethod1.setId(null);
        assertThat(participationMethod1).isNotEqualTo(participationMethod2);
    }
}
