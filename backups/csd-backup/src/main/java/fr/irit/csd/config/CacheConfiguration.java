package fr.irit.csd.config;

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

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(CsdProperties csdProperties) {
        CsdProperties.Cache.Ehcache ehcache = csdProperties.getCache().getEhcache();

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
            createCache(cm, fr.irit.csd.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, fr.irit.csd.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, fr.irit.csd.domain.User.class.getName());
            createCache(cm, fr.irit.csd.domain.Authority.class.getName());
            createCache(cm, fr.irit.csd.domain.User.class.getName() + ".authorities");
            createCache(cm, fr.irit.csd.domain.CodecisionMethod.class.getName());
            createCache(cm, fr.irit.csd.domain.SelectionCriteria.class.getName());
            createCache(cm, fr.irit.csd.domain.InvolvedUser.class.getName());
            createCache(cm, fr.irit.csd.domain.InvolvedUser.class.getName() + ".decisions");
            createCache(cm, fr.irit.csd.domain.InvolvedUser.class.getName() + ".proposals");
            createCache(cm, fr.irit.csd.domain.Collaboration.class.getName());
            createCache(cm, fr.irit.csd.domain.Collaboration.class.getName() + ".proposals");
            createCache(cm, fr.irit.csd.domain.Parameter.class.getName());
            createCache(cm, fr.irit.csd.domain.Decision.class.getName());
            createCache(cm, fr.irit.csd.domain.Vulnerability.class.getName());
            createCache(cm, fr.irit.csd.domain.Vulnerability.class.getName() + ".risks");
            createCache(cm, fr.irit.csd.domain.Vulnerability.class.getName() + ".proposals");
            createCache(cm, fr.irit.csd.domain.Vulnerability.class.getName() + ".mitigations");
            createCache(cm, fr.irit.csd.domain.Vulnerability.class.getName() + ".threats");
            createCache(cm, fr.irit.csd.domain.Threat.class.getName());
            createCache(cm, fr.irit.csd.domain.Threat.class.getName() + ".vulnerabilities");
            createCache(cm, fr.irit.csd.domain.ParticipationMethod.class.getName());
            createCache(cm, fr.irit.csd.domain.ParticipationMethod.class.getName() + ".parameters");
            createCache(cm, fr.irit.csd.domain.ParticipationMethod.class.getName() + ".selectionCriteria");
            createCache(cm, fr.irit.csd.domain.Risk.class.getName());
            createCache(cm, fr.irit.csd.domain.Risk.class.getName() + ".proposals");
            createCache(cm, fr.irit.csd.domain.Risk.class.getName() + ".vulnerabilities");
            createCache(cm, fr.irit.csd.domain.Proposal.class.getName());
            createCache(cm, fr.irit.csd.domain.Proposal.class.getName() + ".changes");
            createCache(cm, fr.irit.csd.domain.Proposal.class.getName() + ".risks");
            createCache(cm, fr.irit.csd.domain.Proposal.class.getName() + ".decisions");
            createCache(cm, fr.irit.csd.domain.Proposal.class.getName() + ".vulnerabilities");
            createCache(cm, fr.irit.csd.domain.Change.class.getName());
            createCache(cm, fr.irit.csd.domain.Mitigation.class.getName());
            createCache(cm, fr.irit.csd.domain.Mitigation.class.getName() + ".vulnerabilities");
            createCache(cm, fr.irit.csd.domain.Intent.class.getName());
            createCache(cm, fr.irit.csd.domain.Application.class.getName());
            createCache(cm, fr.irit.csd.domain.Knowuse.class.getName());
            createCache(cm, fr.irit.csd.domain.Solution.class.getName());
            createCache(cm, fr.irit.csd.domain.DecisionPattern.class.getName());
            createCache(cm, fr.irit.csd.domain.DecisionPattern.class.getName() + ".collaborations");
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
