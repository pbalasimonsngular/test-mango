import Link from "next/link";
import styles from "./exercise.module.css";

export default function Exercise({
  text,
  path,
}: {
  text: string;
  path: string;
}) {
  return (
    <Link href={path} className={styles.link}>
      <article className={styles.exercise}>{text}</article>
    </Link>
  );
}
