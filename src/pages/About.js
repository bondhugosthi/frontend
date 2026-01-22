import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaHandshake, FaTrophy, FaUsers } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import './About.css';

const About = () => {
  const values = [
    {
      icon: <FaHeart />,
      title: 'Brotherhood',
      description: 'We believe in the power of friendship and unity. Our community is built on mutual respect, trust, and genuine care for one another.'
    },
    {
      icon: <FaHandshake />,
      title: 'Community Service',
      description: 'Giving back to society is at the heart of everything we do. We actively participate in social work to make a positive difference.'
    },
    {
      icon: <FaTrophy />,
      title: 'Excellence',
      description: 'We strive for excellence in all our endeavors, whether in sports, cultural activities, or community initiatives.'
    },
    {
      icon: <FaUsers />,
      title: 'Inclusivity',
      description: 'Our doors are open to everyone. We celebrate diversity and welcome people from all backgrounds to be part of our family.'
    }
  ];

  const milestones = [
    { year: '2010', title: 'Foundation', description: 'Bondhu Gosthi was established with a vision to create a community of friends' },
    { year: '2012', title: 'First Tournament', description: 'Organized our first inter-club cricket tournament' },
    { year: '2015', title: 'Social Initiative', description: 'Launched our first large-scale food distribution program' },
    { year: '2018', title: 'Cultural Excellence', description: 'Hosted the biggest Ganapati Puja celebration in the region' },
    { year: '2020', title: 'Pandemic Support', description: 'Provided essential supplies to 1000+ families during COVID-19' },
    { year: '2024', title: 'Growing Strong', description: '500+ active members and 150+ events organized' }
  ];

  return (
    <div className="about-page">
      <PageHeader
        title="About Us"
        subtitle="Learn about our journey, values, and the family that makes Bondhu Gosthi special"
        breadcrumbs={['Home', 'About Us']}
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
              <h2 className="mission-title">Our Mission</h2>
              <p className="mission-text">
                To create a vibrant community that brings people together through sports, cultural activities, 
                and social work, fostering brotherhood and making a positive impact on society.
              </p>
            </motion.div>

            <motion.div
              className="mission-card"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="mission-title">Our Vision</h2>
              <p className="mission-text">
                To be recognized as a leading community organization that exemplifies unity, excellence, 
                and social responsibility, inspiring others to contribute to the betterment of society.
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
            <h2 className="section-title text-center">Our Story</h2>
            <p className="section-subtitle text-center">How Bondhu Gosthi Became a Family</p>
            
            <div className="story-text">
              <p>
                Bondhu Gosthi began in 2010 with a simple idea: to create a space where friends could come together, 
                celebrate life, and make a difference in their community. What started as a small group of friends 
                has grown into a family of over 500 active members.
              </p>
              <p>
                Over the years, we've organized countless events, from exciting sports tournaments to vibrant 
                cultural celebrations like Ganapati Puja. But more importantly, we've touched thousands of lives 
                through our social work initiatives, providing food, education support, and assistance to those 
                in need.
              </p>
              <p>
                Today, Bondhu Gosthi stands as a testament to the power of friendship and community. We are not 
                just a club - we are a family that supports each other, celebrates together, and works hand in 
                hand to create a better tomorrow.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section section-dark about-values">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-subtitle">The principles that guide everything we do</p>
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
            <h2 className="section-title">Our Journey</h2>
            <p className="section-subtitle">Key milestones in our history</p>
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
      <section className="section about-cta">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="cta-title">Want to Be Part of Our Family?</h2>
            <p className="cta-description">
              Join Bondhu Gosthi and be part of something meaningful. Together, we can create beautiful 
              memories and make a positive impact on our community.
            </p>
            <a href="/contact" className="btn btn-primary btn-lg">
              Get in Touch
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
