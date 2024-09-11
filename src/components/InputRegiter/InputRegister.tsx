import { useRef } from "react";
import styles from "./InputRegister.module.css"


interface inputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    changevalue: (newValue: string) => void;
}

export const InputRegister = ({label,changevalue,...props}: inputProps) => {

    const inputRef = useRef<HTMLInputElement>(null)

    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.key == "Escape") {
            inputRef.current?.blur();
        }
    }

    return (
        <div className={styles.body} onClick={() => inputRef.current?.focus()}>
            <label htmlFor="newGroupName">{label}</label>
            <input
                {...props}
                id="newGroupName"
                required
                ref={inputRef}
                onKeyDown={handleKeyDown}
                value={props.value}
                onChange={(e) => changevalue(e.target.value)}
                type={props.type}
            />
        </div>
    )
}