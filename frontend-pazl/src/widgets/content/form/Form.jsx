import { Button } from '../../../shared/ui-kit/button';

export const Form = ({
	stylesForm,
	stylesErrors,
	stylesErrorsItem,
	handleSubmit,
	onSubmit,
	isSubmitting,
	isValid,
	buttonText,
	submitButtonStyle,
	allErrors,
	children,
}) => {
	return (
		<form className={stylesForm} onSubmit={handleSubmit(onSubmit)}>
			{children}
			<Button
				type="submit"
				isLoading={isSubmitting}
				disabled={!isValid}
				className={submitButtonStyle}
			>
				{isSubmitting ? 'Загрузка...' : buttonText}
			</Button>

			{allErrors.length > 0 && (
				<div>
					<ul className={stylesErrors}>
						{allErrors.map((errorMessage, index) => (
							<li key={index} className={stylesErrorsItem}>
								{'>'}
								{errorMessage}
							</li>
						))}
					</ul>
				</div>
			)}
		</form>
	);
};
