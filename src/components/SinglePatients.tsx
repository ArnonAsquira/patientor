import React, { useState } from "react";
import { Entry, Patient } from "../types";
import { Icon } from "semantic-ui-react";
import { useStateValue } from "../state/state";
import AddEntryModal from "../addEntryModal/Entryindex";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { EntryFormValues } from "../addEntryModal/addEntryForm";

interface SinglePatientProps {
  patient?: Patient;
}

const SinglePatient = ({ patient }: SinglePatientProps) => {
  const [state, dispatch] = useStateValue();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [entryError, setEntryError] = useState<string>("");

  function cloesModal(): void {
    setModalOpen(false);
  }

  async function createNewEntry(value: EntryFormValues): Promise<void> {
    try {
      console.log("hello");
      const { data } = await axios.post<Entry>(
        `${apiBaseUrl}patients/${value.id}/entries`
      );
      dispatch({ type: "ADD_ENTRY", payload: { id: value.id, entry: data } });
    } catch (err) {
      setEntryError("something went wrong");
      console.log(err);
    }
  }

  function extraData(entry: Entry) {
    switch (entry.type) {
      case "Hospital":
        return (
          <div>
            discharge: date: {entry.discharge.date}
            criteria: {entry.discharge.criteria}
          </div>
        );
      case "HealthCheck":
        return <div>healthCheckRating:{entry.healthCheckRating}</div>;
      case "OccupationalHealthcare":
        return (
          <div>
            sickLeave: start-date:
            {entry.sickLeave.startDate}
            end-date:{entry.sickLeave.endDate}
          </div>
        );
    }
  }

  return (
    <div className="health-bar">
      <button
        onClick={() => {
          setModalOpen(true);
        }}
      >
        add entries
      </button>
      <AddEntryModal
        modalOpen={modalOpen}
        onClose={cloesModal}
        onSubmit={createNewEntry}
        error={entryError}
      />
      {patient ? (
        <div key={patient.id}>
          <h1>
            {patient.name}{" "}
            {patient.gender === "male" ? (
              <Icon name="mars" />
            ) : (
              <Icon name="venus" />
            )}
          </h1>
          <div>ssn: {patient.ssn}</div>
          <div>occupation: {patient.occupation}</div>
          <div>
            entries{" "}
            {patient.entries?.map((entry) => {
              return (
                <div key={entry.id} style={{ border: "1px solid black" }}>
                  {entry.type === "Hospital" ? (
                    <Icon name="dochub"></Icon>
                  ) : entry.type === "HealthCheck" ? (
                    <Icon name="heart outline"></Icon>
                  ) : (
                    <Icon name="wheelchair"></Icon>
                  )}
                  {
                    <div>
                      <p>date: {entry.date}</p>
                      <p>descriptions: {entry.description}</p>
                      <p>specailist: {entry.specialist}</p>
                      <p>type: {entry.type}</p>
                      <p>
                        diagnosis:{" "}
                        {entry.diagnosisCodes
                          ? entry.diagnosisCodes.map((code) => {
                              return (
                                <li key={code}>
                                  {code}:
                                  {
                                    state.diagnosis?.find(
                                      (diagnosis) => diagnosis.code === code
                                    )?.name
                                  }
                                </li>
                              );
                            })
                          : null}
                      </p>
                      {extraData(entry)}
                    </div>
                  }
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SinglePatient;
