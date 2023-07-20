package org.csd.core.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.csd.core.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CodecisionMethodTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CodecisionMethod.class);
        CodecisionMethod codecisionMethod1 = new CodecisionMethod();
        codecisionMethod1.setId(1L);
        CodecisionMethod codecisionMethod2 = new CodecisionMethod();
        codecisionMethod2.setId(codecisionMethod1.getId());
        assertThat(codecisionMethod1).isEqualTo(codecisionMethod2);
        codecisionMethod2.setId(2L);
        assertThat(codecisionMethod1).isNotEqualTo(codecisionMethod2);
        codecisionMethod1.setId(null);
        assertThat(codecisionMethod1).isNotEqualTo(codecisionMethod2);
    }
}
