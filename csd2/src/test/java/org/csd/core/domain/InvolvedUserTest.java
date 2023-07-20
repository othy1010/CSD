package org.csd.core.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.csd.core.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class InvolvedUserTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(InvolvedUser.class);
        InvolvedUser involvedUser1 = new InvolvedUser();
        involvedUser1.setId(1L);
        InvolvedUser involvedUser2 = new InvolvedUser();
        involvedUser2.setId(involvedUser1.getId());
        assertThat(involvedUser1).isEqualTo(involvedUser2);
        involvedUser2.setId(2L);
        assertThat(involvedUser1).isNotEqualTo(involvedUser2);
        involvedUser1.setId(null);
        assertThat(involvedUser1).isNotEqualTo(involvedUser2);
    }
}
