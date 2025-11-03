import { useState } from "react";
import "./FoodForm.css";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../src/firebase.js"; // ✅ Use Firestore, not storage

export default function FoodForm() {
  const [people, setPeople] = useState([
    {
      id: Date.now(),
      firstName: "",
      lastName: "",
      food: "",
      date: new Date(Date.now()),
    },
  ]);

  const foodOptions = ["Pizza", "Burger", "Sushi", "Pasta", "Salad", "Tacos"];

  const addPerson = () => {
    setPeople([
      ...people,
      {
        id: Date.now(),
        firstName: "",
        lastName: "",
        food: "",
        date: new Date(Date.now()),
      },
    ]);
  };

  const removePerson = (id: number) => {
    setPeople(people.filter((p) => p.id !== id));
  };

  const updateField = (id: number, field: string, value: string) => {
    setPeople(people.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Loop through each person and save separately
      for (const person of people) {
        await addDoc(collection(db, "guests"), {
          firstName: person.firstName,
          lastName: person.lastName,
          food: person.food,
          createdAt: serverTimestamp(),
          date: person.date.toISOString(),
        });
      }

      alert("Visi svečiai sėkmingai įrašyti į duomenų bazę!");
      console.log("Guests saved:", people);

      // Reset form
      setPeople([
        {
          id: Date.now(),
          firstName: "",
          lastName: "",
          food: "",
          date: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Klaida įrašant svečius:", error);
      alert("Nepavyko išsaugoti duomenų. Patikrinkite konsolę.");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {people.map((person) => (
          <div key={person.id} className="person-row">
            <div className="input-group">
              <label>Vardas</label>
              <input
                type="text"
                value={person.firstName}
                onChange={(e) =>
                  updateField(person.id, "firstName", e.target.value)
                }
                placeholder="Įveskite vardą"
                required
              />
            </div>

            <div className="input-group">
              <label>Pavardė</label>
              <input
                type="text"
                value={person.lastName}
                onChange={(e) =>
                  updateField(person.id, "lastName", e.target.value)
                }
                placeholder="Įveskite pavardę"
                required
              />
            </div>

            <div className="input-group">
              <label>Maisto pasirinkimas</label>
              <select
                value={person.food}
                onChange={(e) => updateField(person.id, "food", e.target.value)}
                required
                style={{ color: "#5c5952" }}
              >
                <option value="">Pasirinkite</option>
                {foodOptions.map((food) => (
                  <option style={{ color: "red" }} key={food} value={food}>
                    {food}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="remove-btn"
              onClick={() => removePerson(person.id)}
              disabled={people.length === 1}
            >
              ✕
            </button>
          </div>
        ))}

        <div className="actions">
          <button type="button" onClick={addPerson} className="add-btn">
            + Pridėti dalyvį
          </button>
          <button type="submit" className="submit-btn">
            Pateikti
          </button>
        </div>
      </form>
    </div>
  );
}
