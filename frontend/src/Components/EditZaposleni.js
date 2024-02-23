import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./EditKupac.css";

function EditZaposleni() {
  const { id } = useParams();
  const [zaposleniData, setZaposleniData] = useState({
    ime: "",
    prezime: "",
    email: "",
    adresa: "",
    brojtelefona: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  
  useEffect(() => {
    fetchZaposleniForEditing();
  }, [id]);

  const fetchZaposleniForEditing = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/zaposleni/${id}`);
      if (response.ok) {
        const data = await response.json();
        setZaposleniData(data.data);
      } else {
        console.error("Error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [errors, setErrors] = useState({
    ime: false,
    prezime: false,
    email: false,
    adresa: false,
    brojtelefona: false,
  });

  let navigate = useNavigate();

  const handleUpdate = async (e) => {
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
      const response = await fetch(`http://127.0.0.1:8000/api/zaposleni/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(zaposleniData),
      });

      if (response.ok) {
        console.log("Zaposleni azuriran");
        navigate("/zaposleni");
      } else {
        console.error("Error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    navigate("/zaposleni");
  };

  return (
    <div className="edit-kupac-container">
      <form onSubmit={handleUpdate}>
        <h2>Izmeni zaposlenog</h2>
        <div>
          <label htmlFor="ime">Ime:</label>
          <input
            type="text"
            id="ime"
            name="ime"
            defaultValue={zaposleniData.ime}
            onChange={(e) => setZaposleniData({ ...zaposleniData, ime: e.target.value })}
            required
          />
          {validationErrors.ime && <span className="error">{validationErrors.ime}</span>}
        </div>
        <div>
          <label htmlFor="prezime">Prezime:</label>
          <input
            type="text"
            id="prezime"
            name="prezime"
            value={zaposleniData.prezime}
            onChange={(e) => setZaposleniData({ ...zaposleniData, prezime: e.target.value })}
            required
          />
          {validationErrors.prezime && <span className="error">{validationErrors.prezime}</span>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={zaposleniData.email}
            onChange={(e) => setZaposleniData({ ...zaposleniData, email: e.target.value })}
            required
          />
          {validationErrors.email && <span className="error">{validationErrors.email}</span>}
        </div>
        <div>
          <label htmlFor="adresa">Adresa:</label>
          <input
            type="text"
            id="adresa"
            name="adresa"
            value={zaposleniData.adresa}
            onChange={(e) => setZaposleniData({ ...zaposleniData, adresa: e.target.value })}
            required
          />
          {validationErrors.adresa && <span className="error">{validationErrors.adresa}</span>}
        </div>
        <div>
          <label htmlFor="brojtelefona">Broj telefona:</label>
          <input
            type="text"
            id="brojtelefona"
            name="brojtelefona"
            value={zaposleniData.brojtelefona}
            onChange={(e) => setZaposleniData({ ...zaposleniData, brojtelefona: e.target.value })}
            required
          />
          {validationErrors.brojtelefona && <span className="error">{validationErrors.brojtelefona}</span>}
        </div>
        <div className="btns">
          <button type="submit">Sacuvaj</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditZaposleni;
