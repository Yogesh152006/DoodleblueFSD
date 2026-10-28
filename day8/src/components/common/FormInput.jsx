function FormInput ({label , type , register , erros }){
    return(
        <>
            <div className="input-group">
                <label >
                    {label}
                </label>
                <input type={type} {...register} className="from-input" />
                {erros && <p className='error'>{error}</p>}
            </div>
        </>
    )
}

export default FormInput;