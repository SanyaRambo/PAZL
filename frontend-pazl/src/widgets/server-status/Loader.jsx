import styles from './serverStatus.module.css';

export const Loader = ({ className = '', childClassName = '' }) => {
  const combinedStyles = `${styles.loader} ${className}`;
  const childCombinedStyles = `${styles.dot} ${childClassName}`;

  return (
    <div className={combinedStyles}>
      <div className={childCombinedStyles}></div>
      <div className={childCombinedStyles}></div>
      <div className={childCombinedStyles}></div>
    </div>
  );
};

