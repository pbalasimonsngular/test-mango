import Link from "next/link";
import styles from "./exercise-item.module.css";

export default function ExerciseItem({
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
