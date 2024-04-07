import Image from "next/image";
import styles from "./header.module.css";
import Link from "next/link";

export default function Header() {
  return (
    <header data-testid="header" className={styles.header}>
      <Link data-testid="link" href="/" tabIndex={-1}>
        <Image
          data-testid="img"
          src="https://st.mngbcn.com/images/headerNew/logos/mango.svg"
          alt="logo"
          width={149}
          height={26}
        />
      </Link>
    </header>
  );
}
