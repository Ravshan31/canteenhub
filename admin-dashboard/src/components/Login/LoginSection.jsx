import Container from "../UI/Container";
import Form from 'react-bootstrap/Form';
import FormInput from "./FormInput";
import { useState } from "react";
import Button from 'react-bootstrap/button';
import { useCookies } from "react-cookie";
import jwtDecode from "jwt-decode";

import styles from "./LoginSection.module.css";
import { useRouter } from "next/router";

const LoginSection = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [toShowCode, setToShowCode] = useState(false);
    const [verifyCode, setVerifyCode] = useState("");

    const [, setCookie] = useCookies(["adminToken"]);

    const { push } = useRouter();

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        const adminData = {
            email,
            password
        };

        const rawResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/admin/login`, {
            method: "POST",
            body: JSON.stringify(adminData),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const resData = await rawResponse.json();

        if (resData.msg === "Login failed") {
            if (resData.error === "Given password is incorrect") {
                setPasswordError(resData.error);
            }
            else if (resData.msg.includes("Database/Server")) {
                alert(resData.error)
            } else {
                setEmailError(resData.error)
            }
            return null;
        }

        if (resData.msg === "Invalid body, check 'errors' property for more info.") {
            for (const error of resData.error) {
                const { value, reason } = error;

                if (value === "email") {
                    setEmailError(reason);
                }
                else if (value === "password") {
                    setPasswordError(reason);
                } else {
                    alert("Something went wrong!")
                }
            }

            return null;
        }

        setToShowCode(true);
    }

    const onCodeChange = (e) => {
        const curValue = e.target.value;

        setVerifyCode(curValue);
    }

    const onVerifyBtnHandler = async (e) => {
        e.preventDefault();
        const dataToSend = {
            email,
            password,
            emailCode: `${verifyCode}`
        }

        const rawRequest = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/admin/login-verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        });

        const { token } = await rawRequest.json();

        const { exp } = jwtDecode(token);
        const expDate = new Date(+exp * 1000);

        if (!rawRequest.ok) {
            alert("Verification failed");

            return null;
        }

        setCookie("adminToken", token, {
            expires: expDate,
            sameSite: true,
        });

        push("/");
    }

    return (
        <section className={styles.login}>
            <Container className={styles.login__container}>
                <h1 className={styles.login__title}>Login Page</h1>
                <Form onSubmit={onSubmitHandler} className={styles.loginForm}>
                    <FormInput
                        className={styles.inputWrapper}
                        type="text"
                        label="Enter your email"
                        placeholder={"admin@test.com"}
                        value={email}
                        setValue={setEmail}
                        errorText={emailError}
                        errorState={!emailError}
                    />
                    <FormInput
                        className={styles.inputWrapper}
                        type="password"
                        label="Enter your password"
                        placeholder={"223355"}
                        value={password}
                        setValue={setPassword}
                        errorText={passwordError}
                        errorState={!passwordError}
                    />
                    <Button type="submit" className={styles.formBtn}>Sign In</Button>
                </Form>
                {
                    toShowCode &&
                    <Form className={styles.formCode}>
                        <Form.Group>
                            <Form.Label>Enter email code</Form.Label>
                            <Form.Control minLength={6} value={verifyCode} onChange={onCodeChange} placeholder="123456" type="number" required={true} />
                            <Form.Text hidden></Form.Text>
                        </Form.Group>
                        <Button onClick={onVerifyBtnHandler} className={styles.formBtn} type='submit'>Verify Sign In</Button>
                    </Form>
                }
            </Container>
        </section>
    );
}

export default LoginSection;
