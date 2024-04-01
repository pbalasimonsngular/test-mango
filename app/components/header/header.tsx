import Image from "next/image";
import styles from "./header.module.css";
import Link from "next/link";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/">
        <Image
          src="https://st.mngbcn.com/images/headerNew/logos/mango.svg"
          alt="logo"
          width={149}
          height={26}
        />
      </Link>
    </header>
  );
}
