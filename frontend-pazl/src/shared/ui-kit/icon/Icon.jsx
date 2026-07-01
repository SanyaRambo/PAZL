import styles from './icon.module.css';
import { NavLink } from 'react-router-dom';
import { iconMap } from './iconMap';

export const Icon = ({
  linkName,
  iconName,
  linkClassName,
  windowIconClassName,
  activeIconName,
  isProfile = false,
  disabled = false,
}) => {
  const navLinkClass = linkClassName || styles.iconControlPanel;
  const windowIconStyle = windowIconClassName || styles.windowIcon;

  const IconComponent = iconMap[iconName];
  const ActiveIconComponent = activeIconName ? iconMap[activeIconName] : IconComponent;

  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in iconMap`);
    return null;
  }

  return (
    <div className={windowIconStyle}>
      <NavLink
        to={linkName}
        disabled={disabled}
        className={({ isActive }) =>
          isActive
            ? `${navLinkClass} ${styles.activeLink} ${isProfile ? styles.profileActive : ''}`
            : navLinkClass
        }
      >
        {({ isActive }) => {
          const CurrentIcon = isActive && isProfile ? ActiveIconComponent : IconComponent;
          return (
            <CurrentIcon
              size={isProfile && isActive ? 40 : 25}
              stroke="white"
              strokeWidth={1.5}
              fill="none"
              className={styles.iconSvg}
            />
          );
        }}
      </NavLink>
    </div>
  );
};
