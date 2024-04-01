import ExerciseItem from "./components/exercise-item/exercise-item";
import "./global.css";

export default function Home() {
  return (
    <main className="exercises">
      <ExerciseItem text="Exercise 1" path="exercise1"/>
      <ExerciseItem text="Exercise 2" path="exercise2"/>
    </main>
  );
}
