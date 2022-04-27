import Link from "next/link";
import Container from "../../UI/Container";
import styles from "./Header.module.css";
import { MdFastfood } from 'react-icons/md';
import { FiLogIn } from 'react-icons/fi'

const Header = () => {
    return (
        <header className={styles.header}>
            <Container className={styles.header__container}>
                <nav className={styles.nav}>
                    <Link href="/">
                        <a className={styles.navLink}>
                            <MdFastfood />
                            <span>
                                CanteenHub
                                <br />
                                Admin Dashboard
                            </span>
                        </a>
                    </Link>
                    <Link href="/login">
                        <a className={styles.navSign}>
                            <FiLogIn />
                            Sign In
                        </a>
                    </Link>
                </nav>
            </Container>
        </header>
    );
}

export default Header;
