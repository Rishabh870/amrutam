import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import MedicationCard from "../components/MedicationCard";
import { request } from "../request";
import CaretakerCard from "../components/Caretaker";

const Homepage = () => {
  const [data, setData] = useState([]);
  const [caretakers, setCaretakers] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        console.log(token);
        if (token != null) {
          const reminders = await request("GET", "reminders/allreminders");
          const caretakers = await request("GET", "caregivers/allcaregivers");
          // console.log(caretakers);
          if (caretakers.message !== "No caregivers found for the user") {
            setData(reminders);
            setCaretakers(caretakers);
          }
        }
      } catch (error) {
        console.error("Error making POST request:", error);
      }
    };
    getData();
  }, []);
  return (
    <div>
      <Header />
      <div>
        <h3 className=" ml-4 my-3">CareTakers</h3>
        <div className="row p-0 m-0">
          {caretakers?.map((caretaker) => (
            <div className="col-12 col-md-6 col-lg-3" key={caretaker._id}>
              <CaretakerCard CaretakerData={caretaker} />
            </div>
          ))}
        </div>
      </div>
      <hr />
      <div>
        <h3 className=" ml-4 my-3">Reminders</h3>

        <div className="row p-0 m-0">
          {data?.map((medicationData) => (
            <div className="col-12 col-md-6 col-lg-3" key={medicationData._id}>
              <MedicationCard medicationData={medicationData} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
