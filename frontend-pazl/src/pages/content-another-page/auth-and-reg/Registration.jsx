import styles from './authAndReg.module.css';
import { inputConfig } from '../../../shared/ui-kit/input/input-config';
import { Form } from '../../../widgets/content/form/Form';
import { InputContainer } from '../../../shared/ui-kit/input';
import { useAuthForm } from '../../../shared/hooks';

export const Registration = () => {
	const {
		register,
		handleSubmit,
		onSubmit,
		allErrors,
		setServerError,
		isSubmitting,
		isValid,
	} = useAuthForm('registration');

	const clearError = () => setServerError(null);

	const submitButtonStyle =
		!isValid || isSubmitting ? styles.submitError : styles.submit;

	return (
		<div className={styles.appAuthAndReg}>
			<div className={styles.blockOfformAuthAndReg}>
				<h2 className={styles.formTitle}>REGISTRATION</h2>
				<Form
					stylesForm={styles.forms}
					stylesErrors={styles.errors}
					stylesErrorsItem={styles.errorItem}
					handleSubmit={handleSubmit}
					onSubmit={onSubmit}
					isSubmitting={isSubmitting}
					isValid={isValid}
					buttonText={'Зарегистрироваться'}
					submitButtonStyle={submitButtonStyle}
					allErrors={allErrors}
				>
					<InputContainer
						{...inputConfig.login}
						className={styles.input}
						classNameContainer={styles.InputContainer}
						{...register('login', { onChange: clearError })}
					/>

					<InputContainer
						{...inputConfig.password}
						className={styles.input}
						classNameContainer={styles.InputContainer}
						{...register('password', { onChange: clearError })}
					/>
					<InputContainer
						{...inputConfig.replayPassword}
						className={styles.input}
						classNameContainer={styles.InputContainer}
						{...register('replayPassword', { onChange: clearError })}
					/>
				</Form>
			</div>
		</div>
	);
};
