package org.csd.core.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.csd.core.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class KnowuseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Knowuse.class);
        Knowuse knowuse1 = new Knowuse();
        knowuse1.setId(1L);
        Knowuse knowuse2 = new Knowuse();
        knowuse2.setId(knowuse1.getId());
        assertThat(knowuse1).isEqualTo(knowuse2);
        knowuse2.setId(2L);
        assertThat(knowuse1).isNotEqualTo(knowuse2);
        knowuse1.setId(null);
        assertThat(knowuse1).isNotEqualTo(knowuse2);
    }
}
