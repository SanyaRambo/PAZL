export const Select = ({onChange, id, name, value, className, arrayValues}) => {



	return (
		
		<select
							onChange={onChange}
							name={`${name}`}
							id={`${name}-${id}`}
							value={value}
							className={className}
						>
							{arrayValues?.map((value) => (
								<option key={value.id} value={value.id}>
									{value.name}
								</option>
							))}
		</select>
		
	
	);
}