import styles from "./Container.module.css";
import BootstrapContainer from "react-bootstrap/Container";

const Container = ({ children, className }) => {
    return (
        <BootstrapContainer className={`${styles.container} ${className}`}>
            {children}
        </BootstrapContainer>
    );
}

export default Container;