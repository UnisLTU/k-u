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
      comment: "",
      accommodationNeeded: true,
      numberOfNight: 1,
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
        comment: "",
        accommodationNeeded: true,
        numberOfNight: 1,
      },
    ]);
  };

  const removePerson = (id: number) => {
    setPeople(people.filter((p) => p.id !== id));
  };

  const updateField = (
    id: number,
    field: keyof (typeof people)[number],
    value: string | boolean | number | Date
  ) => {
    setPeople((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
          comment: person.comment,
          accommodationNeeded: person.accommodationNeeded,
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
          comment: "",
          accommodationNeeded: false,
          numberOfNight: 0,
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
        {people.map((person, index) => (
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

            <div className="input-group">
              <label>Komentaras</label>
              <input
                type="text"
                value={person.comment}
                onChange={(e) =>
                  updateField(person.id, "comment", e.target.value)
                }
                placeholder="Įrašykite komentarą"
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flex: 1,
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  className="input-group checkbox-group"
                  style={{ alignItems: "flex-start" }}
                >
                  <label>Ar reikalinga nakvynė?</label>
                  <label>
                    <input
                      type="radio"
                      checked={person.accommodationNeeded}
                      onChange={() => {
                        updateField(person.id, "accommodationNeeded", true);
                        updateField(person.id, "numberOfNight", 1);
                      }}
                    />
                    Taip
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={!person.accommodationNeeded}
                      onChange={() => {
                        updateField(person.id, "accommodationNeeded", false);
                        updateField(person.id, "numberOfNight", 0);
                      }}
                    />
                    Ne
                  </label>
                </div>
              </div>
              {person.accommodationNeeded && (
                <div>
                  <div
                    className="input-group checkbox-group"
                    style={{ alignItems: "flex-start" }}
                  >
                    <label>Naktų skaičius</label>

                    <label style={{ marginRight: 4 }}>
                      <input
                        type="radio"
                        checked={person.numberOfNight === 1}
                        onChange={() =>
                          updateField(person.id, "numberOfNight", 1)
                        }
                      />
                      1 naktis
                    </label>
                    <label>
                      <input
                        type="radio"
                        checked={person.numberOfNight === 2}
                        onChange={() =>
                          updateField(person.id, "numberOfNight", 2)
                        }
                      />
                      2 naktys
                    </label>
                  </div>
                </div>
              )}
            </div>
            {!!index && (
              <button
                type="button"
                className="remove-btn"
                onClick={() => removePerson(person.id)}
                disabled={people.length === 1}
              >
                Ištrinti papildomą svečią
              </button>
            )}
          </div>
        ))}

        <div className="actions">
          <button type="button" onClick={addPerson} className="add-btn">
            + Pridėti svečią
          </button>
          <button type="submit" className="submit-btn">
            Pateikti
          </button>
        </div>
      </form>

      <p style={{ marginTop: 12 }}>
        Vakarienės ir nakvynės pasirinkimo lauksime iki [data]
      </p>
    </div>
  );
}
