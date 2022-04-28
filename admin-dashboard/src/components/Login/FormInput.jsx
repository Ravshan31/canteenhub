import { useCallback } from "react";
import { Form } from "react-bootstrap";

const FormInput = ({ className, type, label, errorText, errorState, placeholder, value, setValue }) => {
    const onInputHandler = useCallback(
        (e) => {
            const currentValue = e.target.value;
            setValue(currentValue)
        },
        [setValue],
    )

    return (
        <Form.Group className={className}>
            <Form.Label>{label}</Form.Label>
            <Form.Control required={true} value={value} onInput={onInputHandler} type={type} placeholder={placeholder} />
            <Form.Text hidden={errorState}>{errorText}</Form.Text>
        </Form.Group>
    );
}

export default FormInput;
