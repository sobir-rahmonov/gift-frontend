import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PEOPLE } from "../utils/format";
import { SearchIcon } from "./Icons";

export default function FinderForm({ initial = {} }) {
  const navigate = useNavigate();
  const [recipient, setRecipient] = useState(initial.recipient || "");
  const [age, setAge] = useState(initial.age || "");
  const [budget, setBudget] = useState(initial.budget || "");

  const submit = (e) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (recipient) q.set("recipient", recipient);
    if (age) q.set("age", age);
    if (budget) q.set("budget", budget);
    navigate(`/finder?${q.toString()}`);
  };

  return (
    <form className="finder" onSubmit={submit}>
      <h2>Sovg'a topish</h2>

      <fieldset className="fieldset">
        <legend className="label">Kimga?</legend>
        <div className="chips">
          {PEOPLE.map((p) => (
            <button
              key={p.value}
              type="button"
              className={"chip" + (recipient === p.value ? " on" : "")}
              aria-pressed={recipient === p.value}
              onClick={() => setRecipient(recipient === p.value ? "" : p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="finder-row">
        <div className="field">
          <label className="label" htmlFor="f-age">Yoshi</label>
          <input
            id="f-age"
            className="input"
            type="number"
            min="0"
            max="120"
            placeholder="Masalan: 30"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="field wide">
          <label className="label" htmlFor="f-budget">Budjet, so'm</label>
          <input
            id="f-budget"
            className="input"
            inputMode="numeric"
            placeholder="Masalan: 300000"
            value={budget}
            onChange={(e) => setBudget(e.target.value.replace(/\D/g, ""))}
          />
        </div>
      </div>

      <button type="submit" className="btn btn-accent btn-lg">
        <SearchIcon width="20" height="20" /> Sovg'a topish
      </button>
    </form>
  );
}