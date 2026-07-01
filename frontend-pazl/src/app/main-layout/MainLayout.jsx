import { ContentRouter } from '../../pages/content-router';
import { Sidebar } from '../../widgets/sidebar';
import { TopHeader } from '../../widgets/top-header';
import styles from './mainLayout.module.css';

function MainLayout() {
	return (
		<div className={styles.app}>
			<Sidebar />
			<div className={styles.positionTopHeaderAndContentPage}>
				
				<ContentRouter className={styles.content} />
			</div>
		</div>
	);
}

export default MainLayout;
