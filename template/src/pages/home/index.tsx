import React from 'react';
import styles from './index.module.scss';

const Home: React.FC = () => {
  console.log('Home');
  return (
    <div className={styles.home}>
      <div>HomePage</div>
    </div>
  );
};

export default Home;
