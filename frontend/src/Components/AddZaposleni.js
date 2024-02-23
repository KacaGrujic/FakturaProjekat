import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddKupac.css";

function AddZaposleni() {
  const [zaposleniData, setZaposleniData] = useState({
    ime: "",
    prezime: "",
    email : "",
    adresa: "",
    brojtelefona: "",
  });

  const [errors, setErrors] = useState({
    ime: false,
    prezime: false,
    email:false,
    adresa: false,
    brojtelefona: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setZaposleniData({
      ...zaposleniData,
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
    Object.keys(zaposleniData).forEach((key) => {
      if (!zaposleniData[key]) {
        formErrors[key] = true;
      }
    });

    if (Object.keys(formErrors).length > 0) {
      // Ukoliko postoji blokiraj korisniku
      setErrors(formErrors);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/zaposleni", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(zaposleniData),
      });

      if (response.status === 201) {
        navigate("/zaposleni");
      } else {
        console.error("Greska prilikom dodavanja zaposlenog");
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleCancel = () => {
    navigate("/zaposleni");
  };

  return (
    <div className={`form-container ${showForm ? "show" : ""}`}>
      <h2>Dodaj zaposlenog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="ime">Ime:</label>
          <input
            type="text"
            id="ime"
            name="ime"
            value={zaposleniData.ime}
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
            value={zaposleniData.prezime}
            onChange={handleChange}
            className={errors.prezime ? "error" : ""}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={zaposleniData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
            required
          />
        </div>


        <div>
          <label htmlFor="adresa">Adresa:</label>
          <input
            type="text"
            id="adresa"
            name="adresa"
            value={zaposleniData.adresa}
            onChange={handleChange}
            className={errors.adresa ? "error" : ""}
            required
          />
        </div>
        
        <div>
          <label htmlFor="brojtelefona">Broj telefona:</label>
          <input
            type="text"
            id="brojtelefona"
            name="brojtelefona"
            value={zaposleniData.brojtelefona}
            onChange={handleChange}
            className={errors.brojtelefona ? "error" : ""}
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

export default AddZaposleni;
