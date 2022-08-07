import { FC } from 'react'

type InputProps = {
    placeholder: string;
    name: string;
    type: string;
    handleChange: Function
}

const Input: FC<InputProps> = ({ placeholder, name, type, handleChange }) => {
    return (
        <input
            placeholder={placeholder}
            name={name}
            step='0.0001'
            type={type}
            onChange={(e) => handleChange(e, name)}
            className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
        />
    )
}

export default Input