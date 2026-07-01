import styles from './authAndReg.module.css';
import { inputConfig } from '../../../shared/ui-kit/input/input-config';
import { Form } from '../../../widgets/content/form/Form';
import { InputContainer } from '../../../shared/ui-kit/input';
import { useAuthForm } from '../../../shared/hooks';

export const Authorization = () => {
	const {
		register,
		handleSubmit,
		onSubmit,
		allErrors,
		setServerError,
		isSubmitting,
		isValid,
	} = useAuthForm('authorization');

	const clearError = () => setServerError(null);

		const submitButtonStyle =
		!isValid || isSubmitting ? styles.submitError : styles.submit;

	return (
		<div className={styles.appAuthAndReg}>
			<div className={styles.blockOfformAuthAndReg}>
				<h2 className={styles.formTitle}>LOGIN</h2>
				<Form stylesForm={styles.forms} stylesErrors={styles.errors} stylesErrorsItem={styles.errorItem} handleSubmit={handleSubmit} onSubmit={onSubmit} isSubmitting={isSubmitting} isValid={isValid} buttonText={'Авторизоваться'} submitButtonStyle={submitButtonStyle} allErrors={allErrors}>
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
				</Form>
			</div>
		</div>
	);
};
