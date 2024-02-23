import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./EditKupac.css";

function EditKupac() {
  const { id } = useParams();
  const [kupacData, setKupacData] = useState({
    ime: "",
    prezime: "",
    adresa: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  
  useEffect(() => {
    fetchKupacForEditing();
  }, [id]);

  const fetchKupacForEditing = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/kupac/${id}`);
      if (response.ok) {
        const data = await response.json();
        setKupacData(data.data);
      } else {
        console.error("Error fetching data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [errors, setErrors] = useState({
    ime: false,
    prezime: false,
    adresa: false,
  });

  let navigate = useNavigate();

  const handleUpdate = async (e) => {
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
      const response = await fetch(`http://127.0.0.1:8000/api/kupac/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(kupacData),
      });

      if (response.ok) {
        console.log("Kupac azuriran");
        navigate("/kupac");
      } else {
        console.error("Error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    navigate("/kupac");
  };

  return (
    <div className="edit-kupac-container">
      <form onSubmit={handleUpdate}>
        <h2>Izmeni kupca</h2>
        <div>
          <label htmlFor="ime">Ime:</label>
          <input
            type="text"
            id="ime"
            name="ime"
            defaultValue={kupacData.ime}
            onChange={(e) => setKupacData({ ...kupacData, ime: e.target.value })}
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
            value={kupacData.prezime}
            onChange={(e) => setKupacData({ ...kupacData, prezime: e.target.value })}
            required
          />
          {validationErrors.prezime && <span className="error">{validationErrors.prezime}</span>}
        </div>
        <div>
          <label htmlFor="adresa">Adresa:</label>
          <input
            type="text"
            id="adresa"
            name="adresa"
            value={kupacData.adresa}
            onChange={(e) => setKupacData({ ...kupacData, adresa: e.target.value })}
            required
          />
          {validationErrors.adresa && <span className="error">{validationErrors.adresa}</span>}
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

export default EditKupac;
