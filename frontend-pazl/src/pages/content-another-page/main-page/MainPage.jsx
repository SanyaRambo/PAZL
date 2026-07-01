import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './mainPage.module.css';
import {
	SquarePen,
	LayoutGrid,
	Library,
	Clock,
	Users,
	MessageCircle,
	User,
} from 'lucide-react';

export const MainPage = () => {
	const navigate = useNavigate();

	const cardVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<div className={styles.container}>
			{/* Дым и частицы уже в глобальных стилях, но добавим локальные слои для усиления */}
			<div className={styles.smokeLayer1} />
			<div className={styles.smokeLayer2} />
			<div className={styles.smokeLayer3} />

			{/* HERO */}
			<section className={styles.hero}>
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: 'easeOut' }}
					className={styles.heroContent}
				>
					<h1 className={styles.heroTitle}>
						Собери свой <span className={styles.gradientText}>PAZL</span>
					</h1>
					<p className={styles.heroSubtitle}>
						Платформа, где рождаются идеи, проекты и сообщества. Всё, что
						нужно для творчества, обучения и продуктивности – в одном месте.
					</p>
					<div className={styles.heroButtons}>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className={`${styles.btn} ${styles.btnPrimary}`}
							onClick={() => navigate('/register')}
						>
							Начать
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className={`${styles.btn} ${styles.btnSecondary}`}
							onClick={() => navigate('/login')}
						>
							Войти
						</motion.button>
					</div>
				</motion.div>
			</section>

			{/* ПРЕИМУЩЕСТВА */}
			<section className={styles.benefits}>
				<h2 className={styles.sectionTitle}>
					Почему <span className={styles.gradientText}>PAZL</span>?
				</h2>
				<div className={styles.benefitsGrid}>
					<BenefitCard
						icon={<SquarePen size={28} />}
						title="Создавай без границ"
						desc="Мощный редактор для текстов, изображений и видео. Воркшоп – твоя творческая лаборатория."
					/>
					<BenefitCard
						icon={<LayoutGrid size={28} />}
						title="Публикуй и вдохновляй"
						desc="Делитесь статьями, заметками, проектами. Получайте обратную связь и находите единомышленников."
					/>
					<BenefitCard
						icon={<Library size={28} />}
						title="Всё под рукой"
						desc="Медиатека хранит все твои посты, избранное и купленный контент. Больше никаких потерянных файлов."
					/>
					<BenefitCard
						icon={<Clock size={28} />}
						title="Управляй временем"
						desc="Тайм-менеджмент с дедлайнами, напоминаниями и прогрессом – работай эффективнее."
					/>
					<BenefitCard
						icon={<MessageCircle size={28} />}
						title="Общайся и развивайся"
						desc="Личные сообщения, комментарии, лайки – живое сообщество вокруг твоих идей."
					/>
					<BenefitCard
						icon={<User size={28} />}
						title="Твой профиль – твоя история"
						desc="Портфолио, достижения, настройки – всё в одном месте. Покажи миру, кто ты."
					/>
				</div>
			</section>

			{/* КОМУ ПОДХОДИТ */}
			<section className={styles.audience}>
				<h2 className={styles.sectionTitle}>
					<span className={styles.gradientText}>PAZL</span> для каждого
				</h2>
				<div className={styles.audienceGrid}>
					<AudienceCard
						icon="/mascot/student.png"
						title="Студентам"
						desc="Конспекты, учебные проекты, обмен материалами."
					/>
					<AudienceCard
						icon="/mascot/teacher.png"
						title="Преподавателям"
						desc="Разработка курсов, взаимодействие с учениками."
					/>
					<AudienceCard
						icon="/mascot/bloger.png"
						title="Авторам и блогерам"
						desc="Создание контента, публикации, аудитория."
					/>
					<AudienceCard
						icon="/mascot/freelancer.png"
						title="Фрилансерам"
						desc="Задачи, портфолио, общение с клиентами."
					/>
					<AudienceCard
						icon="/mascot/biznes.png"
						title="Дельцам"
						desc="Планирование проектов, хранение бизнес-идей."
					/>
					<AudienceCard
						icon="/mascot/development.png"
						title="Любителям саморазвития"
						desc="Сбор знаний, отслеживание прогресса, достижение целей."
					/>
				</div>
			</section>

			{/* ПРИЗЫВ К ДЕЙСТВИЮ */}
			<section className={styles.cta}>
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					Готов сделать <span className={styles.gradientText}>PAZL</span> своим?
				</motion.h2>
				<p>Присоединяйся к сообществу творческих и продуктивных людей.</p>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					className={styles.ctaButton}
					onClick={() => navigate('/register')}
				>
					Создать аккаунт
				</motion.button>
			</section>
		</div>
	);
};

const BenefitCard = ({ icon, title, desc }) => {
	return (
		<motion.div
			className={styles.benefitCard}
			whileHover={{ y: -8, boxShadow: '0 12px 40px rgba(64,192,87,0.15)' }}
			transition={{ type: 'spring', stiffness: 300 }}
		>
			<div className={styles.benefitIcon}>{icon}</div>
			<h3>{title}</h3>
			<p>{desc}</p>
			<div className={styles.cardHoverIndicator} />
		</motion.div>
	);
};

const AudienceCard = ({ icon, title, desc }) => (
	<motion.div
		className={styles.audienceCard}
		whileHover={{ y: -4, borderColor: 'rgba(64,192,87,0.3)' }}
		transition={{ duration: 0.2 }}
	>
		<img src={icon} alt={title} className={styles.audienceImg} />
		<h4>{title}</h4>
		<p>{desc}</p>
	</motion.div>
);


