function DropDown({ label , register , error , options}){
    return (
        <div className="input-group">
            <label>{label}</label>

            <select {...register} className="from-input">
                <option value="">Select City </option>
                {options.map((city) => (
                    <option key={city} value={city}>
                    {city}
                    </option>
                ))}
            </select>
        </div>
    )
}
export default DropDown;