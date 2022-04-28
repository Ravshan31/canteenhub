import { Fragment } from "react";
import Head from 'next/head'
import LoginSection from "../../components/Login/LoginSection";

const LoginPage = () => {
    return (
        <Fragment>
            <Head>
                <title>Sign In - Admin Dashboard</title>
            </Head>
            <LoginSection />
        </Fragment>
    );
}

export default LoginPage;