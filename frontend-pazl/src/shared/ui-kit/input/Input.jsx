export const InputContainer = ({
	className,
	classNameContainer,
	type,
	autoComplete,
	name,
	id,
	placeholder,
	titleOfInput,
	...props
}) => {
	return (
		<div className={classNameContainer}>
			<span>
				{titleOfInput}
			</span>
			<input
				type={type}
				className={className}
				id={id}
				placeholder={placeholder}
				name={name}
				autoComplete={autoComplete}
				{...props}
			/>
		</div>
	);
};
