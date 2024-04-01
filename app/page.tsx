import { Exercise } from "./components";
import "./global.css";

export default function Home() {
  return (
    <main className="exercises">
      <Exercise text="Exercise 1" path="exercise1"/>
      <Exercise text="Exercise 2" path="exercise2"/>
    </main>
  );
}
