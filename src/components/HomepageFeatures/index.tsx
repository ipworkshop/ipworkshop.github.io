import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Courses',
    Svg: require('@site/static/img/undraw_teaching_58yg.svg').default,
    description: (
      <>
	
Choose from courses designed to introduce cutting-edge technologies—from 3D printing and IoT to Rust, blockchain, and autonomous cars. Each participant may select one course to attend.      </>
    ),
  },
  {
    title: 'Projects',
    Svg: require('@site/static/img/undraw_project-team_dip6.svg').default,
    description: (
      <>
Bring advanced technologies to life through hands-on projects—from blockchain and embedded systems to cloud infrastructure and autonomous vehicles.      </>
    ),
  },
  {
    title: 'Exhange ideas with others',
    Svg: require('@site/static/img/undraw_conversation_15p8.svg').default,
    description: (
      <>
Connect and exchange ideas with fellow students—collaborate, learn from diverse perspectives, and grow together in a dynamic tech community.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
