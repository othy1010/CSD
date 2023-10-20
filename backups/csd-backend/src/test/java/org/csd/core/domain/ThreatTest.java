package org.csd.core.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.csd.core.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ThreatTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Threat.class);
        Threat threat1 = new Threat();
        threat1.setId(1L);
        Threat threat2 = new Threat();
        threat2.setId(threat1.getId());
        assertThat(threat1).isEqualTo(threat2);
        threat2.setId(2L);
        assertThat(threat1).isNotEqualTo(threat2);
        threat1.setId(null);
        assertThat(threat1).isNotEqualTo(threat2);
    }
}
