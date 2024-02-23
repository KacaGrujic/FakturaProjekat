import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddKupac.css";

function AddKupac() {
  const [kupacData, setKupacData] = useState({
    ime: "",
    prezime: "",
    adresa: "",
  });

  const [errors, setErrors] = useState({
    ime: false,
    prezime: false,
    adresa: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setKupacData({
      ...kupacData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: false,
    });
  };

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => {
      setShowForm(true);
    }, 100);
    return () => clearTimeout(delay);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = {};
    Object.keys(kupacData).forEach((key) => {
      if (!kupacData[key]) {
        formErrors[key] = true;
      }
    });

    if (Object.keys(formErrors).length > 0) {
      // Ukoliko postoji blokiraj korisniku
      setErrors(formErrors);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/kupac", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(kupacData),
      });

      if (response.status === 201) {
        navigate("/kupac");
      } else {
        console.error("Error adding Kupac.");
      }
    } catch (error) {
      console.error("Error adding Kupac:", error);
    }
  };

  const handleCancel = () => {
    navigate("/kupac");
  };

  return (
    <div className={`form-container ${showForm ? "show" : ""}`}>
      <h2>Dodaj kupca</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="ime">Ime:</label>
          <input
            type="text"
            id="ime"
            name="ime"
            value={kupacData.ime}
            onChange={handleChange}
            className={errors.ime ? "error" : ""}
            required
          />
        </div>
        <div>
          <label htmlFor="prezime">Prezime:</label>
          <input
            type="text"
            id="prezime"
            name="prezime"
            value={kupacData.prezime}
            onChange={handleChange}
            className={errors.prezime ? "error" : ""}
            required
          />
        </div>
        <div>
          <label htmlFor="adresa">Adresa:</label>
          <input
            type="text"
            id="adresa"
            name="adresa"
            value={kupacData.adresa}
            onChange={handleChange}
            className={errors.adresa ? "error" : ""}
            required
          />
        </div>
        <div className="buttons-container">
          <button type="submit">Sacuvaj</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddKupac;
