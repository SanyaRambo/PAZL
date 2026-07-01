export const Button = ({
	children,
	isLoading = false,
	disabled = false,
	type = 'button',
	className = '',
	...props
}) => {
	const isDisabled = disabled || isLoading;

	const buttonClassName = className;

	return (
		<button type={type} className={buttonClassName} disabled={isDisabled} {...props}>
			{isLoading ? 'Загрузка...' : children}
		</button>
	);
};

Button.defaultProps = {
	type: 'button',
	isLoading: false,
	disabled: false,
	style: {},
	className: '',
};
