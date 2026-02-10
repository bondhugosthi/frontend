import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaHandshake, FaTrophy, FaUsers } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/PageHeader';
import CtaSection from '../components/CtaSection';
import useSettings from '../utils/useSettings';
import usePageSeo from '../utils/usePageSeo';
import './About.css';

const About = () => {
  const { t } = useTranslation();
  const settings = useSettings();
  usePageSeo({ pageName: 'about' });
  const values = [
    {
      icon: <FaHeart />,
      title: t('about.values.brotherhood.title'),
      description: t('about.values.brotherhood.description')
    },
    {
      icon: <FaHandshake />,
      title: t('about.values.service.title'),
      description: t('about.values.service.description')
    },
    {
      icon: <FaTrophy />,
      title: t('about.values.excellence.title'),
      description: t('about.values.excellence.description')
    },
    {
      icon: <FaUsers />,
      title: t('about.values.inclusivity.title'),
      description: t('about.values.inclusivity.description')
    }
  ];

  const milestones = [
    { year: '2010', title: t('about.milestones.foundation.title'), description: t('about.milestones.foundation.description') },
    { year: '2012', title: t('about.milestones.firstTournament.title'), description: t('about.milestones.firstTournament.description') },
    { year: '2015', title: t('about.milestones.socialInitiative.title'), description: t('about.milestones.socialInitiative.description') },
    { year: '2018', title: t('about.milestones.culturalExcellence.title'), description: t('about.milestones.culturalExcellence.description') },
    { year: '2020', title: t('about.milestones.pandemicSupport.title'), description: t('about.milestones.pandemicSupport.description') },
    { year: '2024', title: t('about.milestones.growingStrong.title'), description: t('about.milestones.growingStrong.description') }
  ];

  return (
    <div className="about-page">
      <PageHeader
        title={t('about.pageTitle')}
        subtitle={t('about.pageSubtitle')}
        breadcrumbs={[t('nav.home'), t('about.pageTitle')]}
      />

      {/* Mission & Vision Section */}
      <section className="section about-mission">
        <div className="container">
          <div className="mission-grid">
            <motion.div
              className="mission-card"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="mission-title">{t('about.missionTitle')}</h2>
              <p className="mission-text">
                {t('about.missionText')}
              </p>
            </motion.div>

            <motion.div
              className="mission-card"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="mission-title">{t('about.visionTitle')}</h2>
              <p className="mission-text">
                {t('about.visionText')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section about-story">
        <div className="container">
          <motion.div
            className="story-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title text-center">{t('about.storyTitle')}</h2>
            <p className="section-subtitle text-center">{t('about.storySubtitle')}</p>
            
            <div className="story-text">
              <p>{t('about.storyP1')}</p>
              <p>{t('about.storyP2')}</p>
              <p>{t('about.storyP3')}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section section-dark about-values">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">{t('about.valuesTitle')}</h2>
            <p className="section-subtitle">{t('about.valuesSubtitle')}</p>
          </div>

          <div className="values-grid">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="value-icon">{value.icon}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section about-timeline">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">{t('about.journeyTitle')}</h2>
            <p className="section-subtitle">{t('about.journeySubtitle')}</p>
          </div>

          <div className="timeline">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                className={`timeline-item ${index % 2 === 0 ? 'timeline-left' : 'timeline-right'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="timeline-content">
                  <div className="timeline-year">{milestone.year}</div>
                  <h3 className="timeline-title">{milestone.title}</h3>
                  <p className="timeline-description">{milestone.description}</p>
                </div>
                <div className="timeline-marker"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CtaSection
        title={settings?.cta?.title || t('about.ctaTitle')}
        description={settings?.cta?.description || t('about.ctaDescription')}
        primaryLabel={settings?.cta?.primaryLabel || t('about.ctaButton')}
        primaryLink={settings?.cta?.primaryLink || '/contact'}
        secondaryLabel={settings?.cta?.secondaryLabel || t('nav.events')}
        secondaryLink={settings?.cta?.secondaryLink || '/events'}
      />
    </div>
  );
};

export default About;
