package org.csd.core.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration =
            Eh107Configuration.fromEhcacheCacheConfiguration(
                CacheConfigurationBuilder
                    .newCacheConfigurationBuilder(Object.class, Object.class, ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                    .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                    .build()
            );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, org.csd.core.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, org.csd.core.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, org.csd.core.domain.User.class.getName());
            createCache(cm, org.csd.core.domain.Authority.class.getName());
            createCache(cm, org.csd.core.domain.User.class.getName() + ".authorities");
            createCache(cm, org.csd.core.domain.CodecisionMethod.class.getName());
            createCache(cm, org.csd.core.domain.SelectionCriteria.class.getName());
            createCache(cm, org.csd.core.domain.InvolvedUser.class.getName());
            createCache(cm, org.csd.core.domain.InvolvedUser.class.getName() + ".decisions");
            createCache(cm, org.csd.core.domain.InvolvedUser.class.getName() + ".proposals");
            createCache(cm, org.csd.core.domain.Collaboration.class.getName());
            createCache(cm, org.csd.core.domain.Collaboration.class.getName() + ".proposals");
            createCache(cm, org.csd.core.domain.Parameter.class.getName());
            createCache(cm, org.csd.core.domain.Decision.class.getName());
            createCache(cm, org.csd.core.domain.Vulnerability.class.getName());
            createCache(cm, org.csd.core.domain.Vulnerability.class.getName() + ".risks");
            createCache(cm, org.csd.core.domain.Vulnerability.class.getName() + ".proposals");
            createCache(cm, org.csd.core.domain.Vulnerability.class.getName() + ".mitigations");
            createCache(cm, org.csd.core.domain.Vulnerability.class.getName() + ".threats");
            createCache(cm, org.csd.core.domain.Threat.class.getName());
            createCache(cm, org.csd.core.domain.Threat.class.getName() + ".vulnerabilities");
            createCache(cm, org.csd.core.domain.ParticipationMethod.class.getName());
            createCache(cm, org.csd.core.domain.ParticipationMethod.class.getName() + ".parameters");
            createCache(cm, org.csd.core.domain.ParticipationMethod.class.getName() + ".selectionCriteria");
            createCache(cm, org.csd.core.domain.Risk.class.getName());
            createCache(cm, org.csd.core.domain.Risk.class.getName() + ".proposals");
            createCache(cm, org.csd.core.domain.Risk.class.getName() + ".vulnerabilities");
            createCache(cm, org.csd.core.domain.Proposal.class.getName());
            createCache(cm, org.csd.core.domain.Proposal.class.getName() + ".changes");
            createCache(cm, org.csd.core.domain.Proposal.class.getName() + ".risks");
            createCache(cm, org.csd.core.domain.Proposal.class.getName() + ".decisions");
            createCache(cm, org.csd.core.domain.Proposal.class.getName() + ".vulnerabilities");
            createCache(cm, org.csd.core.domain.Change.class.getName());
            createCache(cm, org.csd.core.domain.Mitigation.class.getName());
            createCache(cm, org.csd.core.domain.Mitigation.class.getName() + ".vulnerabilities");
            createCache(cm, org.csd.core.domain.Intent.class.getName());
            createCache(cm, org.csd.core.domain.Application.class.getName());
            createCache(cm, org.csd.core.domain.Knowuse.class.getName());
            createCache(cm, org.csd.core.domain.Solution.class.getName());
            createCache(cm, org.csd.core.domain.DecisionPattern.class.getName());
            createCache(cm, org.csd.core.domain.DecisionPattern.class.getName() + ".collaborations");
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
