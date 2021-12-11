import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { TextField, SelectField, EntryTypeOption } from "./EntryFormField";
import { Entry } from "../types";

/*
 * use type Patient, but omit id and entries,
 * because those are irrelevant for new patient object.
 */
export type EntryFormValues = Entry;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const entryOptions: EntryTypeOption[] = [
  { value: "Hospital", label: "Hospital" },
  { value: "HealthCheck", label: "HealthCheck" },
  { value: "OccupationalHealthcare", label: "OccupationalHealthcare" },
];

export function AddEntryForm({ onSubmit, onCancel }: Props) {
  return (
    <Formik
      initialValues={{
        id: "",
        date: "",
        type: "HealthCheck",
        specialist: "",
        description: "",
        healthCheckRating: 1,
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.id) {
          errors.name = requiredError;
        }
        if (!values.date) {
          errors.datw = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.description) {
          errors.description = requiredError;
        }
        return errors;
      }}
    >
      {() => {
        return (
          <Form className="form ui">
            <SelectField
              label="entry-type"
              name="entry-type"
              options={entryOptions}
            />
            <Field
              label="Id"
              placeholder="Id"
              name="Id"
              component={TextField}
            />
            <Field
              label="description"
              placeholder="description"
              name="description"
              component={TextField}
            />
            <Field
              label="date"
              placeholder="YYYY-MM-DD"
              name="dateOfBirth"
              component={TextField}
            />
            <Field
              label="speacialist"
              placeholder="speacialist"
              name="speacalist"
              component={TextField}
            />
            <Field
              label="diagnosisCodes"
              placeholder="diagnosisCodes"
              name="diagnosisCodes"
              component={TextField}
            />
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button type="submit" floated="right" color="green">
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
}
