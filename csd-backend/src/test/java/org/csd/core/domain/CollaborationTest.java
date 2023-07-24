package org.csd.core.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.csd.core.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CollaborationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Collaboration.class);
        Collaboration collaboration1 = new Collaboration();
        collaboration1.setId(1L);
        Collaboration collaboration2 = new Collaboration();
        collaboration2.setId(collaboration1.getId());
        assertThat(collaboration1).isEqualTo(collaboration2);
        collaboration2.setId(2L);
        assertThat(collaboration1).isNotEqualTo(collaboration2);
        collaboration1.setId(null);
        assertThat(collaboration1).isNotEqualTo(collaboration2);
    }
}
